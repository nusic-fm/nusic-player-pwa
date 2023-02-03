/* eslint-disable @next/next/no-img-element */
import { Box } from "@mui/system";
import TextField from "@mui/material/TextField";
import { useRef, useState } from "react";
import { useSearchBox } from "react-instantsearch-hooks-web";
import { Popper } from "@mui/material";
import Suggestions from "./Suggestions";

interface Props {
  onSuggestionSelect: (id: string) => void;
}

const SearchBar = ({ onSuggestionSelect }: Props) => {
  const searchRef = useRef(null);
  const [showSuggestions, setShowSuggestion] = useState(false);

  //   const { items, refine } = useRefinementList({
  //     attribute: "artist",
  //   });
  const { query, refine, clear } = useSearchBox();

  return (
    <Box p={2}>
      <Box
        display={"flex"}
        justifyContent="center"
        alignContent={"center"}
        ref={searchRef}
      >
        <TextField
          placeholder="Search"
          autoComplete="off"
          size="small"
          onChange={(e) => {
            if (e.target.value.length < 3) {
              setShowSuggestion(false);
              return;
            }
            setShowSuggestion(true);
            refine(e.target.value);
          }}
        />
      </Box>
      <Popper
        open={showSuggestions}
        anchorEl={searchRef.current}
        sx={{ width: "80%" }}
      >
        <Suggestions
          onSuggestionSelect={(songId: string) => {
            setShowSuggestion(false);
            onSuggestionSelect(songId);
          }}
        />
      </Popper>
    </Box>
  );
};

export default SearchBar;
