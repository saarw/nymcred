export type NymcredWs = {
  "version": "0.1.0",
  "name": "nymcred_ws",
  "instructions": [
    {
      "name": "mintCredential",
      "accounts": [
        {
          "name": "service",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "credential",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "credentialId",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "credential",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          }
        ]
      }
    }
  ]
};

export const IDL: NymcredWs = {
  "version": "0.1.0",
  "name": "nymcred_ws",
  "instructions": [
    {
      "name": "mintCredential",
      "accounts": [
        {
          "name": "service",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "credential",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "credentialId",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "credential",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          }
        ]
      }
    }
  ]
};
