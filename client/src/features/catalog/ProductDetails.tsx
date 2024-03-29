import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configStore";
import {
  addBasketItemAsync,
  removeBasketItemAsync,
} from "../basket/basketSlice";
import { fetchProductAsync, productsSelectors } from "./catalogSlice";

export default function ProductDetails() {
  const { basket, status } = useAppSelector((state: any) => state.basket);
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const product = useAppSelector((state: any) =>
    productsSelectors.selectById(state, id!)
  );
  const { status: productStatus } = useAppSelector((state: any) => state.catalog);
  const [quantity, setQuantity] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const item = basket?.items.find((i: any) => i.productId === product?.id!);

  function handleInputChange(event: any) {
    if (event.target.value >= 0) {
      setQuantity(parseInt(event.target.value));
    }
  }

  function handleUpdateCart() {
    console.log(quantity)
    if (!item || quantity > item.quantity) {
      const updatedQuantity = item ? quantity - item.quantity : quantity;
      dispatch(
        addBasketItemAsync({
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          productId: product?.id!,
          quantity: updatedQuantity,
        })
      );
    } else {
      const updatedQuantity = item.quantity - quantity;
      dispatch(
        removeBasketItemAsync({
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          productId: product?.id!,
          quantity: updatedQuantity,
        })
      );
    }
  }

  useEffect(() => {
    if (item) setQuantity(item.quantity);
    if (!product && id) dispatch(fetchProductAsync(parseInt(id)));
  }, [id, item, dispatch, product]);

  if (productStatus.includes("pending"))
    return <LoadingComponent message="Loading product..." />;

  if (!product) return <NotFound />;

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img
          src={product.pcitureUrl}
          alt={product.name}
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color="secondary">
          {(product.price / 100).toFixed(2)}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>QuantityInStock</TableCell>
                <TableCell>{product.quantityInStock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              onChange={handleInputChange}
              variant="outlined"
              type="number"
              label="Quantity in your cart"
              fullWidth
              value={quantity}
            />
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              disabled={
                item?.quantity === quantity || (!item && quantity === 0)
              }
              loading={status.includes(
                "pendingAddItem" + item?.productId + quantity
              )}
              onClick={handleUpdateCart}
              sx={{ height: "55px" }}
              color="primary"
              size="large"
              variant="contained"
              fullWidth
            >
              {item ? "Update Quantity " : "Add to Cart"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
