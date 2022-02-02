import React from "react";
import Footer from '../components/components/footer';
import { createGlobalStyle } from 'styled-components';
import ProgressButton from 'react-progress-button'

import { useLocation } from "@reach/router";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #212428;
  }
`;




const Colection = function (props) {

  // const location = useLocation()
  const data = props.location.state.from;
  console.log(data);

  const [openMenu, setOpenMenu] = React.useState(true);
  const [openMenu1, setOpenMenu1] = React.useState(false);
  const handleBtnClick = () => {
    setOpenMenu(!openMenu);
    setOpenMenu1(false);
    document.getElementById("Mainbtn").classList.add("active");
    document.getElementById("Mainbtn1").classList.remove("active");
  };
  const handleBtnClick1 = () => {
    setOpenMenu1(!openMenu1);
    setOpenMenu(false);
    document.getElementById("Mainbtn1").classList.add("active");
    document.getElementById("Mainbtn").classList.remove("active");
  };

  const handleClick3 = ()=>{
    return new Promise(function(resolve, reject) {
      setTimeout(resolve, 3000)
    })
  };

  return (
    <div>
      <GlobalStyles />

      <section className='container'>
        <div className='row mt-md-5 pt-md-4'>

          

          <div className="col-md-6 text-center">
            <img src={data.image} style={{ "maxBlockSize": 350 }} className="img-fluid img-rounded mb-sm-30" alt="" />
          </div>
          <div className="col-md-6">
            <div className="item_info">

              <h2>{data.title}</h2>
              <div className="item_info_counts">
                <div className="item_info_type"><i className="fa fa-image"></i>Art</div>

              </div>
              <p>{data.description}</p>
              <input type="button" value="Buy Now" className="btn-main" />



              <div className="spacer-40"></div>

              <div className="de_tab">



              </div>

            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
export default Colection;