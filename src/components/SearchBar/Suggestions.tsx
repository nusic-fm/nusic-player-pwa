import { ListItemButton, List, Paper, ListItemText } from "@mui/material";
import { useHits } from "react-instantsearch-hooks-web";

interface Props {
  onSuggestionSelect: (id: string) => void;
}

const Suggestions = ({ onSuggestionSelect }: Props) => {
  const { hits, results, sendEvent } = useHits();

  return (
    <Paper elevation={2} sx={{ width: "100%" }}>
      <List>
        {hits.map((hit) => (
          <ListItemButton
            key={hit.objectID}
            onClick={() => onSuggestionSelect(hit.objectID)}
          >
            {(hit as any).name.slice(0, 10)}
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};

export default Suggestions;
