#![allow(
    unused_imports,
    unused_variables,
    dead_code,
    unused_must_use,
    unreachable_code
)]

// =============================================================================
// Snippets from: src/content/docs/explore/pubkycore/sdk.md
// =============================================================================

async fn snippet_quick_example() -> anyhow::Result<()> {
    let signup_token: Option<String> = None;
    // --8<-- [start:rust_quick_example]
    use pubky::{ClientId, Keypair, Pubky, PublicKey};

    // Initialize
    let pubky = Pubky::new()?;
    let keypair = Keypair::random();
    let homeserver =
        PublicKey::try_from("8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo").unwrap();

    // Sign up and sign in
    let signer = pubky.signer(keypair);
    signer.signup(&homeserver, signup_token.as_deref()).await?;
    let session = signer
        .signin(ClientId::new("myapp.example").unwrap())
        .await?;

    // Write data (requires the "json" feature)
    let profile = serde_json::json!({"name": "Alice", "bio": "Building on Pubky!"});
    session
        .storage()
        .put_json("/pub/myapp/profile", &profile)
        .await?;

    // Read data
    let profile: serde_json::Value = session.storage().get_json("/pub/myapp/profile").await?;
    // --8<-- [end:rust_quick_example]
    Ok(())
}
