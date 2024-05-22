import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Typography,
  Pagination,
  Box,
  TableSortLabel,
  Button,
  AppBar,
  Toolbar,
  Container,
  CssBaseline,
} from "@mui/material";
import { saveAs } from "file-saver";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#f18070",
    },
  },
  typography: {
    h4: {
      fontWeight: "bold",
    },
    subtitle1: {
      fontWeight: "bold",
    },
    body1: {
      fontWeight: "bold",
    },
  },
});

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://openlibrary.org/search.json?title=the+lord+of+the+rings&limit=${limit}&page=${page}`
        );
        const data = await response.json();
        if (data.docs && data.docs.length > 0) {
          setBooks(data.docs);
          setTotalCount(data.num_found);
          setTotalPages(Math.ceil(data.num_found / limit));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [page, limit]);

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
  };

  const handlePageChange = (event ,value) => {
    setPage(value);
  };

  const handleSort = (column) => {
    let direction = "asc";
    if (sortConfig.key === column && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: column, direction: direction });
  };

  const sortedBooks = React.useMemo(() => {
    let sortableBooks = [...books];
    if (sortConfig.key !== null) {
      sortableBooks.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableBooks;
  }, [books, sortConfig]);

  const downloadCSV = () => {
    const headers = [
      "ratings_average",
      "author_name",
      "title",
      "first_publish_year",
      "subject",
      "author_birth_date",
      "author_top_work",
    ];
    const rows = sortedBooks.map((book) => [
      book.ratings_average,
      book.author_name ? book.author_name.join(", ") : "",
      book.title,
      book.first_publish_year,
      book.subject ? book.subject.join(", ") : "",
      book.author_birth_date,
      book.author_top_work,
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "books.csv");
  };
  if (!isAuthenticated) {
    loginWithRedirect();
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" color="white">
            Book Explorer
          </Typography>
          <div style={{ marginLeft: "auto" }}>
            <LogoutButton />
          </div>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
        <Box my={4}>
          <Typography variant="h4" gutterBottom>
            Books Information
          </Typography>
          <Typography variant="body1" gutterBottom>
            Total Count: {totalCount}
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography variant="subtitle1">Records per page:</Typography>
            <Select value={limit} onChange={handleLimitChange}>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </Box>
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    "ratings_average",
                    "author_name",
                    "title",
                    "first_publish_year",
                    "subject",
                    "author_birth_date",
                    "author_top_work",
                  ].map((column) => (
                    <TableCell
                      key={column}
                      sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                    >
                      <TableSortLabel
                        active={sortConfig.key === column}
                        direction={sortConfig.direction}
                        onClick={() => handleSort(column)}
                      >
                        {column
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedBooks.map((book, index) => (
                  <TableRow
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f0f0f0" : "#ffffff",
                    }}
                  >
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      {book.ratings_average}
                    </TableCell>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      {book.author_name && book.author_name.join(", ")}
                    </TableCell>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      {book.title}
                    </TableCell>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      {book.first_publish_year}
                    </TableCell>
                    <TableCell
                      style={{ maxHeight: "100px", overflowY: "auto" }}
                    >
                      {book.subject &&
                      book.subject.join(" ").split(" ").length > 30 ? (
                        <Box style={{ maxHeight: "100px", overflowY: "auto" }}>
                          {book.subject.join(" ")}
                        </Box>
                      ) : (
                        book.subject && book.subject.join(", ")
                      )}
                    </TableCell>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      {book.author_birth_date ? book.author_birth_date : "N/A"}
                    </TableCell>{" "}
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      {book.author_top_work ? book.author_top_work : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={3} display="flex" justifyContent="center">
            <Pagination
              color="primary"
              count={totalPages}
              page={page}
              onChange={handlePageChange}
            />
          </Box>
          <Box mt={3} display="flex" justifyContent="center">
            <Button variant="contained" color="primary" onClick={downloadCSV}>
              Download CSV
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default HomePage;
