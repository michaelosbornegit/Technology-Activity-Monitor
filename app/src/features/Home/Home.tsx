import { Paper, Typography } from "@mui/material"
import React from "react";
import PastDaySessions from "./PastDaySessions";

const Home = (): JSX.Element => {

  return (
    <>
      <Paper sx={{ padding: '50px' }}>
        <Typography variant="h4">Past 24 hours Activity:</Typography>
        <div style={{height: '500px'}}>
        <PastDaySessions />

        </div>
      </Paper>
    </>
  )
}

export default Home;