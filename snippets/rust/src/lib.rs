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

async fn snippet_init_client() -> anyhow::Result<()> {
    // --8<-- [start:init_client]
    use pubky::Pubky;

    let pubky = Pubky::new()?;
    // --8<-- [end:init_client]
    Ok(())
}

async fn snippet_signup() -> anyhow::Result<()> {
    let signup_token: Option<String> = None;
    // --8<-- [start:signup]
    use pubky::{Keypair, Pubky, PublicKey};

    let pubky = Pubky::new()?;
    let keypair = Keypair::random();
    let homeserver =
        PublicKey::try_from("8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo").unwrap();

    let signer = pubky.signer(keypair);
    let session = signer.signup(&homeserver, signup_token.as_deref()).await?;
    // --8<-- [end:signup]
    Ok(())
}

async fn snippet_signin() -> anyhow::Result<()> {
    use pubky::{Keypair, Pubky};
    let pubky = Pubky::new()?;
    let keypair = Keypair::random();
    // --8<-- [start:signin]
    let signer = pubky.signer(keypair);
    let session = signer.signin().await?;
    // --8<-- [end:signin]
    Ok(())
}

async fn snippet_put() -> anyhow::Result<()> {
    use pubky::{Keypair, Pubky};
    let pubky = Pubky::new()?;
    let session = pubky.signer(Keypair::random()).signin().await?;
    let profile = serde_json::json!({"name": "Alice"});
    // --8<-- [start:put]
    session
        .storage()
        .put("/pub/myapp/profile", serde_json::to_string(&profile)?)
        .await?;
    // --8<-- [end:put]
    Ok(())
}

async fn snippet_get() -> anyhow::Result<()> {
    use pubky::{Keypair, Pubky};
    let pubky = Pubky::new()?;
    let session = pubky.signer(Keypair::random()).signin().await?;
    // --8<-- [start:get]
    let resp = session.storage().get("/pub/myapp/profile").await?;
    let text = resp.text().await?;
    // --8<-- [end:get]
    Ok(())
}

async fn snippet_delete() -> anyhow::Result<()> {
    use pubky::{Keypair, Pubky};
    let pubky = Pubky::new()?;
    let session = pubky.signer(Keypair::random()).signin().await?;
    // --8<-- [start:delete]
    session.storage().delete("/pub/myapp/profile").await?;
    // --8<-- [end:delete]
    Ok(())
}

async fn snippet_list() -> anyhow::Result<()> {
    use pubky::{Keypair, Pubky};
    let pubky = Pubky::new()?;
    let session = pubky.signer(Keypair::random()).signin().await?;
    // --8<-- [start:list]
    let entries = session
        .storage()
        .list("/pub/myapp/posts/")?
        .limit(20)
        .reverse(true)
        .send()
        .await?;

    for entry in entries {
        println!("{}", entry);
    }
    // --8<-- [end:list]
    Ok(())
}

async fn snippet_public_read() -> anyhow::Result<()> {
    use pubky::Pubky;
    let pubky = Pubky::new()?;
    let user_public_key = "o1gg96ewuojmopcjbz8895478wdtxtzzuxnfjjz8o8e77csa1ngo";
    // --8<-- [start:public_read]
    let resp = pubky
        .public_storage()
        .get(format!("{}/pub/myapp/profile", user_public_key))
        .await?;
    let text = resp.text().await?;
    // --8<-- [end:public_read]
    Ok(())
}

async fn snippet_auth_flow() -> anyhow::Result<()> {
    // --8<-- [start:auth_flow]
    use pubky::{AuthFlowKind, Capabilities, Pubky};

    let pubky = Pubky::new()?;
    let caps = Capabilities::default();
    let flow = pubky.start_auth_flow(&caps, AuthFlowKind::signin())?;

    // Display flow.authorization_url() as QR code for Pubky Ring to scan
    let session = flow.await_approval().await?;
    // --8<-- [end:auth_flow]
    Ok(())
}

// The social feed example defines structs and functions at the top level,
// so it lives in its own module.
mod social_feed {
    // --8<-- [start:social_feed]
    use pubky::{Keypair, Pubky, PubkyResource, PubkySession};
    use serde::{Deserialize, Serialize};

    #[derive(Serialize, Deserialize)]
    struct Post {
        content: String,
        timestamp: i64,
        author: String,
    }

    async fn publish_post(session: &PubkySession, post: &Post) -> anyhow::Result<()> {
        let post_id = post.timestamp.to_string();
        let path = format!("/pub/social/posts/{}", post_id);

        session
            .storage()
            .put(&path, serde_json::to_string(post)?)
            .await?;
        Ok(())
    }

    async fn get_feed(pubky: &Pubky, public_key: &str) -> anyhow::Result<Vec<Post>> {
        let path = format!("{}/pub/social/posts/", public_key);

        let entries: Vec<PubkyResource> = pubky
            .public_storage()
            .list(path)?
            .limit(50)
            .reverse(true)
            .send()
            .await?;

        let mut posts = Vec::new();
        for entry in entries {
            let resp = pubky.public_storage().get(entry.to_string()).await?;
            let post: Post = serde_json::from_slice(&resp.bytes().await?)?;
            posts.push(post);
        }

        Ok(posts)
    }
    // --8<-- [end:social_feed]
}

async fn snippet_events_single_user() -> anyhow::Result<()> {
    // --8<-- [start:events_single_user]
    use futures_util::StreamExt;
    use pubky::{EventType, Pubky, PublicKey};

    let pubky = Pubky::new()?;
    let user = PublicKey::try_from("o1gg96ewuojmopcjbz8895478wdtxtzzuxnfjjz8o8e77csa1ngo").unwrap();

    let mut stream = pubky
        .event_stream_for_user(&user, None)
        .live()
        .subscribe()
        .await?;

    while let Some(result) = stream.next().await {
        let event = result?;
        println!(
            "{}: {} (cursor: {})",
            event.event_type, event.resource, event.cursor
        );
    }
    // --8<-- [end:events_single_user]
    Ok(())
}

async fn snippet_events_multi_user() -> anyhow::Result<()> {
    // --8<-- [start:events_multi_user]
    use futures_util::StreamExt;
    use pubky::{EventCursor, Pubky, PublicKey};

    let pubky = Pubky::new()?;
    let user1 =
        PublicKey::try_from("o1gg96ewuojmopcjbz8895478wdtxtzzuxnfjjz8o8e77csa1ngo").unwrap();
    let user2 =
        PublicKey::try_from("pxnu33x7jtpx9ar1ytsi4yxbp6a5o36gwhffs8zoxmbuptici1jy").unwrap();

    let homeserver = pubky.get_homeserver_of(&user1).await.unwrap();

    let mut stream = pubky
        .event_stream_for(&homeserver)
        .add_users([(&user1, None), (&user2, Some(EventCursor::new(100)))])?
        .live()
        .limit(100)
        .path("/pub/")
        .subscribe()
        .await?;

    while let Some(result) = stream.next().await {
        let event = result?;
        println!("{}: {}", event.event_type, event.resource);
    }
    // --8<-- [end:events_multi_user]
    Ok(())
}

async fn snippet_session_management() -> anyhow::Result<()> {
    // --8<-- [start:session_management]
    use pubky::{Keypair, Pubky};

    let pubky = Pubky::new()?;
    let signer = pubky.signer(Keypair::random());

    // Sign in returns a session
    let session = signer.signin().await?;

    // Session info
    println!("User: {}", session.info().public_key());

    // Sign out invalidates the session
    session.signout().await.map_err(|(e, _)| e)?;
    // --8<-- [end:session_management]
    Ok(())
}

async fn snippet_multi_identity() -> anyhow::Result<()> {
    use pubky::{Keypair, Pubky};
    let keypair_1 = Keypair::random();
    let keypair_2 = Keypair::random();
    // --8<-- [start:multi_identity]
    let pubky = Pubky::new()?;

    let session1 = pubky.signer(keypair_1).signin().await?;
    let session2 = pubky.signer(keypair_2).signin().await?;

    // Each session maintains a separate identity
    // --8<-- [end:multi_identity]
    Ok(())
}

async fn snippet_error_handling() -> anyhow::Result<()> {
    use pubky::{Keypair, Pubky};
    let pubky = Pubky::new()?;
    let session = pubky.signer(Keypair::random()).signin().await?;
    // --8<-- [start:error_handling]
    use pubky::Error;

    match session.storage().get("/pub/myapp/data").await {
        Ok(resp) => println!("Retrieved: {}", resp.text().await?),
        Err(e) => eprintln!("Error: {}", e),
    }
    // --8<-- [end:error_handling]
    Ok(())
}

// =============================================================================
// Snippets from: src/content/docs/explore/pubkycore/homeserver.md
// =============================================================================

#[cfg(feature = "testnet")]
async fn snippet_testnet_embedded() -> anyhow::Result<()> {
    // --8<-- [start:testnet_embedded]
    use pubky_testnet::EphemeralTestnetBuilder;

    let testnet = EphemeralTestnetBuilder::new()
        .with_embedded_postgres()
        .build()
        .await?;
    // --8<-- [end:testnet_embedded]
    Ok(())
}
