import React from 'react';
import { Link } from 'react-router-dom';
import './CommutePage.css';
import './IndexPage.css';
import email2 from './image.png'
import webpage3 from './WebpageScreenshot.png'

const IndexPage = () => {
  return (
    <div>
          <div className='body justify-content-center'>
              <div className='menu-bar'>
                  <div className='group'>
                      <Link to='/signup' className='title'>
                          Commuter Helper
                      </Link>
                  </div>
                  <div className='group'>
                      <div>
                          <Link to='/signup' className='signUp'>
                              Sign Up
                          </Link>
                          <Link to='/login' className='item'>
                              Login
                          </Link>
                      </div>
                  </div>
              </div>
            <div className='d-flex flex-column text-center pt-md-5 pt-lg-3'>
                <div>
                    <p className='mt-5 banner'>
                    Make your Daily Commute faster, easier, and less stressful
                    </p>
                </div>
                <div>
                    <p className='mt-5 banner'>
                    Automatically get the fastest route and estimated travel time
                    right when you're about to leave
                    </p>
                </div>
            </div>
        </div>
        <div className="new-section bg-light">
            <div className="container">
                <div className="row iphone-holder">
                    <div className="col-md-6 ">
                        <div class="iphone-x">
                            <div class="side">
                                <div class="screen">
                                      <img src={email2} width={300} height={652} />
                                </div>
                            </div>
                            <div class="line"></div>
                            <div class="header">
                                <div class="sensor-1"></div>
                                <div class="sensor-2"></div>
                                <div class="sensor-3"></div>
                            </div>
                            <div class="volume-button"></div>
                            <div class="power-button"></div>
                        </div>
                    </div>
                    <div className="col-md-6 d-flex align-items-center">
                        <div className='iphone-banner'>
                            Get a daily email that contains all the details
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='new-section'>
            <div class="mac-screen">
                
                <div class="camera"></div>
                <img className='webpage' src={webpage3} width={990} height={630}/>
            </div>
            <div class="mac-body">
            <div class="lid"></div>
            </div> 
            <div>
                <p className='mt-5 banner'>
                Easily See and Schedule Your Commute on the Same Page 
                </p>
            </div>
        </div>
    </div>
    
  );
};

export default IndexPage;
