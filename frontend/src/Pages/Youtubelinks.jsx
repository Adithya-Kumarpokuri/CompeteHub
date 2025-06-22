import React,{useState, useEffect} from 'react'
import leetcode from '../assets/leetcode.svg';
import codechef from '../assets/codechef.svg';
import youtube from '../assets/youtube.svg';
import codeforces from '../assets/codeforces.svg';
import edit from '../assets/edit.svg';
import {
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  DialogTitle,
  Button,
  Container,
  TextField,
} from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const Youtubelinks = () => {
     const [contests,setContests]=useState([]);
     const [pastContests,setPastContest]=useState([]);
     const [youtubelink,setYoutubeLink]=useState([]);
     const [dialog,setDialog]=useState(false);
     const [formData,setFormData]=useState({});
     const URL = 'http://localhost:3000/api/v1/contest/get_all_contest';
     
     useEffect(() => {
        const fetchFilteredContests = async () => {
          try {
            const response = await fetch(`${URL}`);
            const data = await response.json();
      
            // Handle YouTube link fetch safely
            const youtube = await fetch(`http://localhost:3000/api/v1/youtube/get_youtubeLink`);
            let youtubeData = { links: [] };
      
            if (youtube.ok) {
              youtubeData = await youtube.json();
            } else if (youtube.status === 404) {
              console.warn("No YouTube links found");
            } else {
              throw new Error("Failed to fetch YouTube links");
            }
      
            setYoutubeLink(youtubeData.links);
      
            // Sort contests
            const sortedRunningContests = data.data.current_contests.sort((a, b) => b.starttimeint - a.starttimeint);
            const sortedPastContests = data.data.past_contests.sort((a, b) => b.starttimeint - a.starttimeint);
            const limitedPastContests = sortedPastContests.slice(0, 100);
            setPastContest(limitedPastContests);
          } catch (error) {
            console.error('Error fetching contests or YouTube links:', error);
          }
        };
      
        fetchFilteredContests();
      }, []);
      

     const handleEditClick = async (contest,youtubeLinkDisplay) => {
         setDialog(true);
         console.log(contest);
         const curr={
            Contest_id: contest.Contest_id,
            Contest_Name: contest.Name,
            youtubeLink:youtubeLinkDisplay
         }
         setFormData(curr);
     };
     const handleSubmit = async(e)=>{
          e.preventDefault();
          try {
            const response = await fetch('http://localhost:3000/api/v1/youtube/add_youtubeLink', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contest_id: formData.Contest_id,
                youtubelink: formData.youtubeLink,
              }),
            });

            if (response.ok) {
              const result = await response.json();
              alert("Added Youtube Link")
              setDialog(false);
            } else {
              console.error('Failed to add YouTube link');
            }
          } catch (error) {
            console.error('Error:', error);
          }
     }
     const handleChange=async(e)=>{
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
      console.log(formData);
     }
  return ( 
     <Box 
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "rgba(46, 56, 72, 0.88)",
          minHeight: "100vh",
        }}
      >
    <Container sx={{ marginTop: '2%', backgroundColor: "rgba(46, 56, 72, 0.88)", }}>
      <Dialog open={dialog} onClose={() => setDialog(false)} fullWidth maxWidth="sm">
        <Grid container style={{ display: 'flex' }}>
          <Grid item xs={11}>
            <DialogTitle>Add YouTube Link</DialogTitle>
          </Grid>
          <Grid item xs={1}>
            <IconButton aria-label="close" onClick={() => setDialog(false)} xs={2} style={{ alignContent: 'end' }}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="contestId"
                  label="Contest ID"
                  fullWidth
                  value={formData.Contest_id}
                  required
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="Contest Name"
                  label="Contest Name"
                  fullWidth
                  value={formData.Contest_Name}
                  onChange={handleChange}
                  required
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="youtubeLink"
                  label="YouTube Link"
                  fullWidth
                  value={formData.youtubeLink}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add Link
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          marginTop: 6,
          marginBottom: 4,
          padding: 2,
          maxWidth: {
            xs: 400,
            sm: 600,
            md: 800,
            lg: 1200
          }
        }}
      >
        <Box sx={{ padding: 2, textAlign: "center", fontWeight: "bold", fontSize: "1.5rem", color: "white" }}>
          Past Contests
        </Box>
        <Table
          sx={{
            "& .MuiTableCell-root": {
              color: "white"
            },
            "& .MuiTableCell-head": {
              fontWeight: "bold"
            }
          }}
        >
          <TableHead sx={{ backgroundColor: "rgba(6, 164, 227, 0.39)" }}>
            <TableRow>
              <TableCell sx={{ width: '20%' }}>Platform</TableCell>
              <TableCell sx={{ width: '30%' }}>Name</TableCell>
              <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Start Time</TableCell>
              <TableCell sx={{ display: {  sm: "table-cell" } }}>Video Solutions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pastContests.map((contest, index) => {
              const URLs = {
                Codechef: 'https://www.codechef.com',
                Leetcode: 'https://leetcode.com/contest',
                Codeforces: 'https://codeforces.com/contest'
              };
              const platformIcons = {
                Codeforces: codeforces,
                Leetcode: leetcode,
                Codechef: codechef
              };
                return (
                <TableRow key={index}>
                  <TableCell
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                  window.open(`${URLs[contest.Platform]}/${contest.Contest_id}`, '_blank');
                  }}
                  >
                  {platformIcons[contest.Platform] ? (
                  <>
                  <img
                    src={platformIcons[contest.Platform]}
                    alt={contest.Platform}
                    width="20"
                    height="20"
                    style={{ marginRight: "8px" }}
                  />
                  {contest.Platform}
                  </>
                  ) : (
                  contest.Platform
                  )}
                  </TableCell>
                  <TableCell
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                  window.open(`${URLs[contest.Platform]}/${contest.Contest_id}`, '_blank');
                  }}
                  >{contest.Name}</TableCell>
                  <TableCell
                  sx={{ cursor: "pointer",
                  display: { xs: "none", sm: "table-cell", cursor: "pointer" }
                   }}
                  onClick={() => {
                    window.open(`${URLs[contest.Platform]}/${contest.Contest_id}`, '_blank');
                    }}
                    >{contest["Start Time"]}</TableCell>
                    <TableCell sx={{ display: { sm: "table-cell", textAlign: "center", justifyContent: "space-around" } }}>
                    {youtubelink.some(link => link.contest_id === contest.Contest_id) ? (
                      <img
                      src={youtube}
                      alt="youtube"
                      width="25"
                      height="25"
                      style={{ cursor: "pointer", marginRight: "60px" }}
                      onClick={() => {
                        const link = youtubelink.find(link => link.contest_id === contest.Contest_id);
                        window.open(link.youtubelink, '_blank');
                      }}
                      />
                    ) : (
                      <span style={{ color: "white",marginRight: "20px" }}> Please add the YouTube link</span>
                    )}
                    <img
                      src={edit}
                      alt="edit"
                      width="25"
                      height="25"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        const link = youtubelink.find(link => link.contest_id === contest.Contest_id);
                  handleEditClick(contest,link);
                  }}
                  />
                  </TableCell>
                </TableRow>
                );
            })}
          </TableBody>
        </Table>
      </TableContainer>
  </Box>
  )
}

export default Youtubelinks