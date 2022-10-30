import styled from "@emotion/styled";
import { Button, FormControl, Grid, Paper, TextField, Typography } from "@mui/material"
import React, { useState } from "react";
import { BasicToken, CreateBasicToken } from "@serverTypes/basic-token";
import { mintNft } from "../../services/api";

const InputGrid = styled(Grid)({
  display: 'flex',
  flexDirection: 'column',
  '> *:not(:last-child)': {
    marginBottom: '20px'
  }
});

const NftInfoGrid = styled(Grid)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  // minHeight: 'calc(100vh - 50px)',
  padding: '20px'
})

const basicTokenDefaults: CreateBasicToken = {
  name: 'Change me!'
}

const Mint = (): JSX.Element => {

  const [basicToken, setBasicToken] = useState<CreateBasicToken>({ ...basicTokenDefaults });

  const handleOnChange = (
    e: { target: { value: unknown } },
    key: keyof BasicToken | keyof BasicToken['metadata'],
    isMetadata?: boolean
  ) => {
    let value = e.target.value;

    // if (key === 'date') value = CETStringToDate(value as string).toISOString();

    if (isMetadata) {
      setBasicToken({ ...basicToken, metadata: { ...basicToken?.metadata, [key]: value } });
      return;
    }

    setBasicToken({ ...basicToken, [key]: value });
  };

  const onSubmit = async () => {
    await mintNft(basicToken);
  }

  return (
    <>
    <Paper sx={{padding: '50px'}}>
      <Grid container spacing={2}>
        <InputGrid item xs={6}>
          <Typography variant="h3">Mint your token</Typography>
          <FormControl>
            <TextField label='NFT Name' value={basicToken.name || ''} onChange={(e) => handleOnChange(e, 'name')} />
          </FormControl>
          <Button onClick={onSubmit}>Mint</Button>



        </InputGrid>
        <NftInfoGrid item xs={6}>
          <Typography variant="body1">...Nft info/json here...</Typography>
        </NftInfoGrid>
      </Grid>
    </Paper>
    </>
  )
}

export default Mint;