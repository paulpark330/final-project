import React, { useEffect, useState, useContext } from 'react';
import AppContext from '../lib/app-context';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import { DropzoneArea } from 'material-ui-dropzone';
import {
  makeStyles,
  Select,
  InputLabel,
  MenuItem,
  createTheme,
  ThemeProvider
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { AddAPhoto } from '@material-ui/icons';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import InputAdornment from '@material-ui/core/InputAdornment';

const useStyles = makeStyles({
  field: {
    marginTop: 20,
    marginBottom: 20,
    display: 'block'
  },
  button: {
    color: 'white'
  }
});

const theme = createTheme({
  overrides: {
    MuiDropzoneArea: {
      root: {
        display: 'flex',
        minHeight: 60
      },
      textContainer: {
        textAlign: 'start',
        display: 'flex',
        alignItems: 'center'
      },
      icon: {
        width: 30,
        height: 30,
        margin: 20
      }
    },
    MuiDropzonePreviewList: {
      root: {
        display: 'inline',
        margin: 0
      },
      imageContainer: {
        display: 'inline',
        padding: '4px !important'
      },
      image: {
        maxWidth: 80,
        maxHeight: 80,
        objectFit: 'cover',
        boxShadow: 'none',
        padding: 4,
        borderRadius: 10
      }
    }
  }
});

export default function NewPost() {
  const classes = useStyles();
  const [formValues, setFormValues] = useState({
    title: '',
    category: '',
    price: '',
    description: ''
  });
  const [location, setLocation] = useState('');
  const [files, setFiles] = useState([]);
  const userId = useContext(AppContext);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      const KEY = 'AIzaSyDmADdAoHWHYXYsnAe1YAVaPgnlR6Fohow';
      let address = '';
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${KEY}`
      )
        .then(res => res.json())
        .then(result => {
          address = result.results[4].formatted_address;
          setLocation(address);
        });
    });
  });

  const [titleError, setTitleError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [priceError, setPriceError] = useState(false);

  const handleChange = prop => e => {
    setFormValues({ ...formValues, [prop]: e.target.value });
  };

  const handleSelectedFiles = files => {
    setFiles(files);
  };

  const resetForm = () => {
    setFormValues({
      title: '',
      category: '',
      price: '',
      description: ''
    });
    setFiles([]);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setTitleError(false);
    setCategoryError(false);
    setPriceError(false);
    const newPost = new FormData(event.target);
    newPost.append('image', files[0]);
    newPost.append('userId', userId);
    newPost.append('location', location);
    newPost.set('price', formValues.price);

    if (formValues.title === '') {
      setTitleError(true);
    }

    if (formValues.category === '') {
      setCategoryError(true);
    }

    if (formValues.price === '') {
      setPriceError(true);
    }

    if (formValues.title && formValues.category && formValues.price) {
      const init = {
        method: 'POST',
        body: newPost
      };
      fetch('/api/new-post', init)
        .then(res => res.json())
        .then(result => {
          document.querySelector('#upload-form').reset();
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  return (
    <Container>
      <form
        id="upload-form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        onReset={resetForm}
      >
        <ThemeProvider theme={theme}>
          <DropzoneArea
            showAlerts={false}
            name="image"
            Icon={AddAPhoto}
            filesLimit={6}
            acceptedFiles={['image/*']}
            dropzoneText=""
            onChange={handleSelectedFiles}
          ></DropzoneArea>
        </ThemeProvider>
        <TextField
          className={classes.field}
          label="Post title"
          variant="outlined"
          color="primary"
          onChange={handleChange('title')}
          fullWidth
          required
          error={titleError}
          name="title"
        />
        <FormControl
          variant="outlined"
          className={classes.field}
          fullWidth
          required
          error={categoryError}
        >
          <InputLabel id="select-category">Category</InputLabel>
          <Select
            className={classes.field}
            labelId="select-category"
            label="Category"
            value={formValues.category}
            onChange={handleChange('category')}
            autoWidth
            name="category"
          >
            <MenuItem value="electronics">Electronics</MenuItem>
            <MenuItem value="furniture">Furniture</MenuItem>
            <MenuItem value="home-diy">Home & DIY</MenuItem>
            <MenuItem value="baby-kids">Baby & Kids</MenuItem>
            <MenuItem value="women-fashion">Women&apos;s Fashion</MenuItem>
            <MenuItem value="men-fashion">Men&apos;s Fashion</MenuItem>
            <MenuItem value="health-beauty">Health & Beauty</MenuItem>
            <MenuItem value="sports-leisure">Sports & Leisure</MenuItem>
            <MenuItem value="books-music">Books & Music</MenuItem>
            <MenuItem value="musical-instruments">Musical Instruments</MenuItem>
            <MenuItem value="vehicles-parts">Vehicles & Parts</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          className={classes.field}
          label="Price"
          name="price"
          variant="outlined"
          color="primary"
          onChange={handleChange('price')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">$</InputAdornment>
            )
          }}
          fullWidth
          required
          error={priceError}
        />
        <TextField
          className={classes.field}
          label="Item description"
          name="description"
          variant="outlined"
          color="primary"
          onChange={handleChange('description')}
          multiline
          rows={6}
          fullWidth
        />
        <Button
          className={classes.button}
          type="submit"
          color="primary"
          variant="contained"
          endIcon={<KeyboardArrowRightIcon />}
        >
          Done
        </Button>
      </form>
    </Container>
  );
}