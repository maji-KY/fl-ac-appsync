use proc_macro2::TokenStream;
use quote::{quote, quote_spanned};
use syn::spanned::Spanned;
use syn::{
    parse_macro_input, parse_quote, Attribute, Data, DeriveInput, Fields, GenericArgument,
    GenericParam, Generics, Ident, Lit, Meta, PathArguments, Type,
};

#[proc_macro_derive(RdsdataMapper, attributes(rdsdata_mapper))]
pub fn derive(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = parse_macro_input!(input as DeriveInput);

    // Used in the quasi-quotation below as `#name`.
    let name = input.ident;

    // Add a bound `T: HeapSize` to every type parameter T.
    let generics = add_trait_bounds(input.generics);
    let (impl_generics, ty_generics, where_clause) = generics.split_for_impl();

    // Generate an expression.
    let table_name = get_table_name(input.attrs, &name);
    let generated_select = generate_select(&input.data);
    let generated_mapping = generate_mapping(&input.data);

    let expanded = quote! {
        impl #impl_generics #name #ty_generics #where_clause {
            pub fn select(where_clause: &str) -> String {
                format!("select {} from {} {}", #generated_select, #table_name, where_clause)
            }
        }

        impl #impl_generics rdsdata_mapper::typeclass::MapTo<#name #ty_generics> #where_clause for Vec<aws_sdk_rdsdata::model::Field> {
            fn map_to_model(&self) -> Result<#name, rdsdata_mapper::error::MappingError> {
                Ok(#name {
                    #generated_mapping
                })
            }
        }
    };
    proc_macro::TokenStream::from(expanded)
}

// Add a bound
fn add_trait_bounds(mut generics: Generics) -> Generics {
    for param in &mut generics.params {
        if let GenericParam::Type(ref mut type_param) = *param {
            type_param.bounds.push(parse_quote!(std::fmt::Debug));
        }
    }
    generics
}

fn get_convert_exp(index: usize, ty: &Type) -> TokenStream {
    match ty {
        syn::Type::Path(x) if x.path.is_ident("String") => {
            quote! { rdsdata_mapper::convert::to_string(&self[#index])? }
        }
        syn::Type::Path(x) if x.path.is_ident("i64") => {
            quote! { rdsdata_mapper::convert::as_i64(&self[#index])? }
        }
        syn::Type::Path(x) if x.path.is_ident("f64") => {
            quote! { rdsdata_mapper::convert::as_f64(&self[#index])? }
        }
        syn::Type::Path(x) if x.path.is_ident("bool") => {
            quote! { rdsdata_mapper::convert::as_boolean(&self[#index])? }
        }
        syn::Type::Path(x) if x.path.segments[0].ident.to_string() == "Option" => {
            let param_arg = match x.path.segments[0].arguments {
                PathArguments::AngleBracketed(ref params) => params.args.first(),
                _ => None,
            };
            let patam_type = match param_arg {
                Some(GenericArgument::Type(ref ty)) => ty,
                _ => unimplemented!(),
            };
            let conv_exp = get_convert_exp(index, patam_type);
            quote! {
                if self[#index].is_is_null() {
                    None
                } else {
                    Some(#conv_exp)
                }
            }
        }
        _ => {
            unimplemented!()
        }
    }
}

fn get_table_name(attrs: Vec<Attribute>, name: &Ident) -> String {
    let mapping_option = attrs
        .iter()
        .find(|attr| attr.path.is_ident("rdsdata_mapper"))
        .map(|attr| attr.parse_args());
    match mapping_option {
        Some(Ok(Meta::NameValue(named))) if named.path.is_ident("table_name") => match named.lit {
            Lit::Str(table_name_lit) => table_name_lit.value(),
            _ => unimplemented!(),
        },
        _ => name.to_string().to_lowercase(),
    }
}

// Generate
fn generate_select(data: &Data) -> String {
    match *data {
        Data::Struct(ref data) => match data.fields {
            Fields::Named(ref fields) => {
                let recurse: Vec<String> = fields
                    .named
                    .iter()
                    .map(|f| {
                        let original_name: String = f.ident.as_ref().unwrap().to_string();
                        let mapping_option = f
                            .attrs
                            .iter()
                            .find(|attr| attr.path.is_ident("rdsdata_mapper"))
                            .map(|attr| attr.parse_args());
                        match mapping_option {
                            Some(Ok(Meta::NameValue(named)))
                                if named.path.is_ident("column_name") =>
                            {
                                match named.lit {
                                    Lit::Str(column_name_lit) => column_name_lit.value(),
                                    _ => unimplemented!(),
                                }
                            }
                            _ => original_name,
                        }
                    })
                    .collect();
                recurse.join(",")
            }
            _ => unimplemented!(),
        },
        _ => unimplemented!(),
    }
}

fn generate_mapping(data: &Data) -> TokenStream {
    match *data {
        Data::Struct(ref data) => match data.fields {
            Fields::Named(ref fields) => {
                let recurse = fields.named.iter().enumerate().map(|(i, f)| {
                    let name = &f.ident;
                    let mapping_option = f
                        .attrs
                        .iter()
                        .find(|attr| attr.path.is_ident("rdsdata_mapper"))
                        .map(|attr| attr.parse_args());
                    let index = match mapping_option {
                        Some(Ok(Meta::NameValue(named))) if named.path.is_ident("index") => {
                            match named.lit {
                                Lit::Int(index_lit) => index_lit.base10_parse::<usize>().unwrap(),
                                _ => unimplemented!(),
                            }
                        }
                        _ => i,
                    };
                    let convert_exp = get_convert_exp(index, &f.ty);
                    quote_spanned! {f.span()=>
                        #name: #convert_exp,
                    }
                });
                quote! {
                    #(#recurse)*
                }
            }
            _ => unimplemented!(),
        },
        _ => unimplemented!(),
    }
}
