import React from "react";
import {Card, CardContent, Typography, Box} from '@mui/material';

function CreateLists({
    title,
    doi,
    publication_year,
    cited_by_count,
    is_oa,
    abstract,
}){
    return (
      <Card style={{ 
          marginBottom: '20px',
          backgroundColor: is_oa ? '#e0f7fa' : '#fff', 
          boxShadow: '0 6px 12px rgba(0,0,0,0.1)', 
          maxWidth:'60%',
          //borderLeft: '2px solid', 
          //borderColor: is_oa ? '#4caf50' : '#f44336',
      }}>

        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" component="div" style={{fontWeight:'bold'}}>
              {title}
            </Typography>
            <Typography color="textSecondary" style={{ fontSize: '14px' }}>{publication_year}</Typography>
          </Box>

          <Typography color="textSecondary" style={{ marginTop: '10px' }}>
            DOI: {doi ? (<a href={doi} target="_blank" rel="noopener noreferrer" style={{ fontStyle: 'italic' }}>{doi}</a>) : ('null')}
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginTop: '10px' }}>
            <Typography variant="body2" color="textPrimary">
              Cited by: <strong>{cited_by_count}</strong>
            </Typography>
            <Typography variant="body2" color={is_oa ? "green" : "red"}>
              Open Access: {is_oa ? 'Yes' : 'No'}
            </Typography>
          </Box>

          <Typography variant="body2" style={{ marginTop: '10px' }} color="textSecondary">
            {abstract.length > 200 ? `${abstract.substring(0, 200)}...` : abstract}
          </Typography>
        </CardContent>
      </Card>
    )
}

export default CreateLists;