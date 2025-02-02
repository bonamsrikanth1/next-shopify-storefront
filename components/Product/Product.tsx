import React, { useState } from 'react';
import Head from 'next/head';
import { useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import withLayout from '../../hocs/withLayout';
import { ProductState } from '../../store/product.slice';
import services from '../../services';
import VariantSelector from './VariantSelector';
import QuantityInput from './QuantityInput';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { useSelector } from '../../store/index';
const useStyles = makeStyles((them: Theme) => ({
  title: {
    margin: 0
  },
  formControl: {
    marginBottom: 20,
    minWidth: 200
  },
  loader: {
    display: 'block',
    width: '100%',
    textAlign: 'center',
    marginBottom: 30
  }
}));

function Product() {
  const dispatch = useDispatch();
  const { loading, error, data }: ProductState = useSelector(({ product }) => product);

  const theme = useTheme();
  const classes = useStyles(theme);

  const [values, setValues] = useState({
    variantId: '',
    quantity: 1
  });

  if (loading) {
    return (
      <div className={classes.loader}>
        <CircularProgress size={24} />
      </div>
    );
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  const variants = data.variants.edges.map(({ node }) => ({ ...node }));
  const images = data.images.edges;
  const imageSrc = images.length
    ? images[0].node.transformedSrc
    : 'http://www.netum.vn/public/default/img/icon/default-product-image.png';
  const altText = images.length ? images[0].node.altText : '';

  return (
    <>
      <Head>
        <title>{data.title} - Next Shopify Storefront</title>
      </Head>
      <br />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={5} md={3}>
          <img src={imageSrc} width="100%" alt={altText} />
        </Grid>
        <Grid item xs={12} sm={7} md={9}>
          <h1 className={classes.title}>{data.title}</h1>
          <p>{data.description}</p>
          <QuantityInput className={classes.formControl} getQuantity={quantity => setValues({ ...values, quantity })} />
          <VariantSelector
            className={classes.formControl}
            options={data.options}
            variants={variants}
            getVariantId={variantId => setValues({ ...values, variantId })}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(services.checkout.addLineItem(values.variantId, values.quantity))}
          >
            Add to Cart
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default withLayout(Product);
