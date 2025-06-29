import React, { useState, useEffect } from "react";
import codeforces from '../assets/codeforces.svg';
import leetcode from '../assets/leetcode.svg';
import codechef from '../assets/codechef.svg';
import youtube from '../assets/youtube.svg';
import bookmark_filled from '../assets/bookmark_filled.svg';
import bookmark_empty from '../assets/bookmark_empty.svg'
import { useNavigate } from 'react-router-dom';
 

import {
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

// Function to convert the UNIX time into Human Readable formate
function getTimeUntilStart(startTimeSeconds) {
  const now = Math.floor(Date.now() / 1000);
  let diff = startTimeSeconds - now;
  if (diff <= 0) return "Started";

  const days = Math.floor(diff / 86400);
  diff %= 86400;
  const hours = Math.floor(diff / 3600);
  diff %= 3600;
  const minutes = Math.floor(diff / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.join(' ');
}

export default function Contests() {
  const [contests,setContests]=useState([]);
  const [myBookMarks,setMyBookMarks]=useState([]);
  const [pastContests,setPastContest]=useState([]);
  const [runningContests,setRunningContest]=useState([]);
  const navigate = useNavigate();
  //const URL = 'http://localhost:3000/api/v1/contest/get_all_contest';
  const URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/contest/get_all_contest`;
  useEffect(() => {
      const userId = localStorage.getItem('UserID');
      if (!userId) {
        navigate('/');
      }
  }, [navigate]);

  // Function to Handle the BookMarks

  const handleBookMark = async (contest) => {
    const email = localStorage.getItem('UserID');
    const Contest_id = contest.Contest_id;

    if (!email || !Contest_id) {
      alert('User ID or Contest ID is missing.');
      return;
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/bookmarks/bookMark_contest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Contest_id, email }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to bookmark contest');
      }
      setMyBookMarks((prevBookmarks) => [...prevBookmarks, Contest_id]);
      const result = await response.json();
      alert('Bookmark successful');
    } catch (error) {
      console.error('Error bookmarking contest:', error);
      alert('Failed to bookmark contest. Please try again later.');
    }
  };

  // Function to Handle the Remove the BookMarks
  const handle_remove_BookMark = async (contest) => {
    const email = localStorage.getItem('UserID');
    const Contest_id = contest.Contest_id;
    
    if (!email || !Contest_id) {
      alert('User ID or Contest ID is missing.');
      return;
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/bookmarks/remove_bookmark_contest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Contest_id, email }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to bookmark contest');
      }
      setMyBookMarks((prevBookmarks) => prevBookmarks.filter(id => id !== Contest_id));
      const result = await response.json();
      alert('Bookmark Removed Successfully');
    } catch (error) {
      console.error('Error bookmarking contest:', error);
      alert('Failed to bookmark contest. Please try again later.');
    }
  };

  // UseEffect which is called only once to fetch the Contests and User BookMarks

  useEffect(() => {
    const fetchFilteredContests = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        console.log(queryParams);
        const response = await fetch(`${URL}?${queryParams.toString()}`);
        const data = await response.json();
        
        const email = localStorage.getItem('UserID');
//         const bookmarksResponse = await fetch(
//   `http://localhost:3000/api/v1/bookmarks/myBookmarks?email=${email}`
// );

        const bookmarksResponse = await fetch(
 `${import.meta.env.VITE_BACKEND_URL}/api/v1/bookmarks/myBookmarks?email=${email}`
);

        const bookmarksData = await bookmarksResponse.json();
        setMyBookMarks(bookmarksData.bookmarks ? bookmarksData.bookmarks : []);
        const sortedUpcomingContests = data.data.upcoming_contests.sort((a, b) => a.starttimeint - b.starttimeint);
        const sortedRunningContests = data.data.current_contests.sort((a, b) => b.starttimeint - a.starttimeint);
        const sortedPastContests = data.data.past_contests.sort((a, b) => b.starttimeint - a.starttimeint);
        const limitedPastContests = sortedPastContests.slice(0, 100);
        setContests(sortedUpcomingContests);
        setRunningContest(sortedRunningContests);
        setPastContest(limitedPastContests);
      } catch (error) {
        console.error('Error fetching contests:', error);
      }
    };

    fetchFilteredContests();
  }, []);

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
          Upcoming Contests
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
              <TableCell>Name</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell sx={{ display: { xs: "none", sm: "none", lg: "table-cell" } }}>Duration</TableCell>
              <TableCell sx={{ display: { xs: "none", sm: "none", lg: "table-cell" } }}>Starts In</TableCell>
              <TableCell sx={{ display: { lg: "table-cell" } }}>BookMark</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contests.map((contest, index) => {
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
                        <img src={platformIcons[contest.Platform]} alt={contest.Platform} width="20" height="20" style={{ marginRight: '8px' }} /> {contest.Platform}
                      </>
                    ) : contest.Platform}
                  </TableCell>
                  <TableCell
                    sx={{ cursor: "pointer", width: '30%' }}
                    onClick={() => {
                      window.open(`${URLs[contest.Platform]}/${contest.Contest_id}`, '_blank');
                    }}
                  >{contest.Name}</TableCell>
                  <TableCell
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open(`${URLs[contest.Platform]}/${contest.Contest_id}`, '_blank');
                    }}
                  >{contest["Start Time"]}</TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "none", lg: "table-cell" } }}>{contest.Duration}</TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "none", lg: "table-cell" } }}>{getTimeUntilStart(contest.starttimeint)}</TableCell>
                  <TableCell sx={{ display: { lg: "table-cell", textAlign: "center" } }}>
                    <img
                      src={myBookMarks.includes(contest.Contest_id) ? bookmark_filled : bookmark_empty}
                      alt="bookmark"
                      width="25"
                      height="25"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (myBookMarks.includes(contest.Contest_id)) {
                          handle_remove_BookMark(contest, myBookMarks.includes(contest.Contest_id) ? bookmark_filled : bookmark_empty);
                        } else {
                          handleBookMark(contest, myBookMarks.includes(contest.Contest_id) ? bookmark_filled : bookmark_empty);
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {
          (
            runningContests && runningContests.length>0 ?  <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              backgroundColor: "transparent",
              boxShadow: "none",
              marginTop: 4,
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
              Running Contests
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
                  <TableCell>Name</TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Start Time</TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Duration</TableCell>
                  <TableCell>Ends In</TableCell>
                  <TableCell sx={{ display: { lg: "table-cell" } }}>BookMark</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(
                  runningContests.map((contest, index) => {
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
                              <img src={platformIcons[contest.Platform]} alt={contest.Platform} width="20" height="20" style={{ marginRight: '8px' }} /> {contest.Platform}
                            </>
                          ) : contest.Platform}
                        </TableCell>
                        <TableCell
                          sx={{ cursor: "pointer" }}
                          onClick={() => {
                            window.open(`${URLs[contest.Platform]}/${contest.Contest_id}`, '_blank');
                          }}
                        >{contest.Name}</TableCell>
                        <TableCell
                          onClick={() => {
                            window.open(`${URLs[contest.Platform]}/${contest.Contest_id}`, '_blank');
                          }}
                          sx={{ display: { xs: "none", sm: "table-cell", cursor: "pointer" } }}>{contest["Start Time"]}</TableCell>
                        <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{contest.Duration}</TableCell>
                        <TableCell>{getTimeUntilStart(contest.endTimeInt)}</TableCell>
                        <TableCell sx={{ display: { sm: "table-cell", textAlign: "center" } }}>
                          <img
                            src={myBookMarks.includes(contest.Contest_id) ? bookmark_filled : bookmark_empty}
                            alt="bookmark"
                            width="25"
                            height="25"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              if (myBookMarks.includes(contest.Contest_id)) {
                                handle_remove_BookMark(contest, myBookMarks.includes(contest.Contest_id) ? bookmark_filled : bookmark_empty);
                              } else {
                                handleBookMark(contest, myBookMarks.includes(contest.Contest_id) ? bookmark_filled : bookmark_empty);
                              }
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  }))}
              </TableBody>
            </Table>
          </TableContainer> : <>
          </>
          )
        }
      

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          marginTop: 4,
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
              <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Duration</TableCell>
              <TableCell sx={{ display: {  sm: "table-cell" } }}>BookMark</TableCell>
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
                  <TableCell
                    sx={{ display: { xs: "none", sm: "table-cell", cursor: "pointer" } }}
                    onClick={() => {
                      window.open(`${URLs[contest.Platform]}/${contest.Contest_id}`, '_blank');
                    }}
                  >
                    {contest.Duration}
                  </TableCell>
                  <TableCell sx={{ display: { sm: "table-cell", textAlign: "center" } }}>
                    <img
                      src={myBookMarks.includes(contest.Contest_id) ? bookmark_filled : bookmark_empty}
                      alt="bookmark"
                      width="25"
                      height="25"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (myBookMarks.includes(contest.Contest_id)) {
                          handle_remove_BookMark(contest, myBookMarks.includes(contest.Contest_id) ? bookmark_filled : bookmark_empty);
                        } else {
                          handleBookMark(contest, myBookMarks.includes(contest.Contest_id) ? bookmark_filled : bookmark_empty);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ display: { sm: "table-cell", textAlign: "center" } }}>
                    <img
                      src={youtube}
                      alt="youtube"
                      width="25"
                      height="25"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        window.open(`https://www.youtube.com/results?search_query=${contest.Name} solutions`, '_blank');
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
  );
}