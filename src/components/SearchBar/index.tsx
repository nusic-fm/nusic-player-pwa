/* eslint-disable @next/next/no-img-element */
import { Box } from "@mui/system";
import TextField from "@mui/material/TextField";
import { useRef } from "react";
import { useSearchBox } from "react-instantsearch-hooks-web";
import { IconButton, Popper } from "@mui/material";
import Suggestions from "./Suggestions";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

interface Props {
  onSuggestionSelect: (id: string) => void;
  clearSearch: () => void;
}

const SearchBar = ({ onSuggestionSelect, clearSearch }: Props) => {
  const searchRef = useRef(null);

  //   const { items, refine } = useRefinementList({
  //     attribute: "artist",
  //   });
  const { query, refine, clear } = useSearchBox();

  return (
    <Box pt={2}>
      <Box
        display={"flex"}
        justifyContent="center"
        alignContent={"center"}
        ref={searchRef}
      >
        <TextField
          value={query}
          placeholder="Search"
          autoComplete="off"
          size="small"
          onChange={(e) => {
            refine(e.target.value);
          }}
          InputProps={{
            endAdornment: (
              <IconButton
                disabled={!query}
                size="small"
                onClick={() => {
                  clear();
                  clearSearch();
                }}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            ),
          }}
        />
      </Box>
      <Popper open={!!query} anchorEl={searchRef.current} sx={{ width: "80%" }}>
        <Suggestions
          onSuggestionSelect={(songId: string) => {
            onSuggestionSelect(songId);
          }}
        />
      </Popper>
    </Box>
  );
};

export default SearchBar;
