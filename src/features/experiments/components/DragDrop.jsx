import { useEffect, useState } from "react";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import PropTypes from 'prop-types'; // ES6
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const DragNdrop = ({
  onFilesSelected,
  width,
  height,
}) => {
  const [files, setFiles] = useState([]);
  const theme = useTheme();

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  useEffect(() => {
    onFilesSelected(files);
  }, [files, onFilesSelected]);

  return (
    <Box
      sx={{
        width: width,
        height: height,
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        p: 2,
      }}
    >
      <Box
        sx={{
          border: `2px dashed ${theme.palette.primary.main}`,
          backgroundColor: theme.palette.background.default,
          padding: theme.spacing(2),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          borderRadius: 2,
          cursor: 'pointer',
          '&.active': {
            borderColor: theme.palette.success.main,
          },
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CloudUploadIcon sx={{ fontSize: 36, mr: 2 }} />
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Arrastra tu rutina aquí
            </Typography>
            <Typography variant="body2">
              Archivos permitidos: <br /> .py o .cpp
            </Typography>
          </Box>
        </Box>
        <input
          type="file"
          hidden
          id="browse"
          onChange={handleFileChange}
          accept=".py,.cpp"
          multiple
        />
        <label htmlFor="browse">
          <Button
            variant="contained"
            component="span"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            Buscar archivo
          </Button>
        </label>
      </Box>

      {files.length > 0 && (
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(1),
            width: '100%',
            height: '30vh',
            overflow: 'auto',
          }}
        >
          {files.map((file, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: theme.spacing(1),
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: theme.shape.borderRadius,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                  {file.name}
                </Typography>
              </Box>
              <IconButton
                onClick={() => handleRemoveFile(index)}
                sx={{ color: theme.palette.error.main }}
              >
                <ClearIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {files.length > 0 && (
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            alignItems: 'center',
            color: theme.palette.success.main,
          }}
        >
          <CheckCircleOutlineIcon sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {files.length} archivo(s) seleccionado(s)
          </Typography>
        </Box>
      )}
    </Box>
  );
};

DragNdrop.propTypes = {
    onFilesSelected: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
}

export default DragNdrop;