import { Box, Typography } from "@mui/material";
import Slider from "react-slick";
import Categories from "../categories/Categories";

export default function HomePage() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <Slider {...settings}>
        <div>
          <img
            src="/images/hero1.jpg"
            alt="hero"
            style={{ display: "block", width: "100%", maxHeight: 500 }}
          />
        </div>
        <div>
          <img
            src="/images/hero2.jpg"
            alt="hero"
            style={{ display: "block", width: "100%", maxHeight: 500 }}
          />
        </div>
        <div>
          <img
            src="/images/hero3.jpg"
            alt="hero"
            style={{ display: "block", width: "100%", maxHeight: 500 }}
          />
        </div>
      </Slider>
      <Box
        display="flex"
        justifyContent="center"
        sx={{
          px: 4,
          marginTop: 5,
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h3">Our Principal Categories!</Typography>
        <Categories />
      </Box>
    </>
  );
}
