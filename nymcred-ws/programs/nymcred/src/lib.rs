use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod nymcred_ws {
    use super::*;

    pub fn mint_credential(ctx: Context<MintCredential>, credential_id: String) -> Result<()> {
        let credential = &mut ctx.accounts.credential;
        credential.owner = ctx.accounts.user.key.key();
        Ok(())
    }
}

#[account]
#[derive(Default)]
pub struct Credential {
    owner: Pubkey,
}

#[derive(Accounts)]
#[instruction(credential_id: String)]
pub struct MintCredential<'info> {
    #[account(mut)]
    pub service: Signer<'info>,
    pub user: Signer<'info>,
    #[account(
    init,
    payer = service,
    space = 32,
    seeds = [b"credential", service.key().as_ref(), credential_id.as_ref()],
    bump
    )]
    pub credential: Account<'info, Credential>,
    pub system_program: Program<'info, System>,
}
