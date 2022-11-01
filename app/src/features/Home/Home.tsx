import { Paper, Typography } from "@mui/material"
import React from "react";
import PastDaySessions from "./PastDaySessions";

const Home = (): JSX.Element => {

  return (
    <>
      <Paper sx={{ padding: '50px' }}>
        <Typography variant="h3">Hello, world!</Typography>
        <div style={{height: '500px'}}>
        <PastDaySessions />

        </div>
      </Paper>
    </>
  )
}

export default Home;