import React from "react";
import {Card, CardContent, Typography} from '@mui/material';

function CreateLists({
    title,
    doi,
    publication_year,
    cited_by_count,
    is_oa,
    summary,
}){
    return (
        <Card variant="outlined" style={{ margin: '10px 0' }}>
      <CardContent>
        <Typography variant="h5">{title}</Typography>
        <Typography color="textSecondary">DOI: {doi}</Typography>
        <Typography>Year: {publication_year}</Typography>
        <Typography>Citations: {cited_by_count}</Typography>
        <Typography>Open Access: {is_oa}</Typography>
        <Typography>{summary}</Typography>
      </CardContent>
    </Card>
    )
}

export default CreateLists;