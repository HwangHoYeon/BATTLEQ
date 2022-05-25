import React from "react";
import { Container, Grid, TextField, Button } from "@material-ui/core";
const PlayChatSend = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={1}>
        <Grid item lg={9}>
          <TextField
            label={"message"}
            value={message}
            fullWidth
            onChange={(e) => setMessage(e.target.value)}
          />
        </Grid>
        <Grid item lg={3}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
            onClick={() => messageSend(message)}
          >
            보내기
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PlayChatSend;
