import { Paper, Typography } from "@mui/material"
import React from "react";
import PastDaySessions from "./PastDaySessions";

const Home = (): JSX.Element => {

  return (
    <>
      <Paper sx={{ padding: '50px' }}>
        <Typography variant="h4" sx={{ marginBottom: '20px' }}>Past 12 hours Activity:</Typography>
        <div style={{ height: '500px' }}>
          <PastDaySessions />

        </div>
      </Paper>
    </>
  )
}

export default Home;