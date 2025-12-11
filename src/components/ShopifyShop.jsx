import { useEffect, useRef, useState } from 'react';

const ShopifyShopNew = () => {
  const shopifyComponentRef = useRef(null);
  const shopifyClientRef = useRef(null);
  const shopifyUIRef = useRef(null);
  const nodeId = 'product-component-1765199249216';
  const isInitializedRef = useRef(false);
  const [shopifyButtonReady, setShopifyButtonReady] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Prevent double initialization
    if (isInitializedRef.current) {
      return;
    }

    const scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

    function ShopifyBuyInit() {
      // Double check to prevent multiple initializations
      if (isInitializedRef.current) {
        return;
      }

      if (window.ShopifyBuy && window.ShopifyBuy.UI) {
        const client = window.ShopifyBuy.buildClient({
          domain: 'd0gqam-e1.myshopify.com',
          storefrontAccessToken: 'bca649bb23a2714d686b28b56a7c4018',
        });

        // Store client reference for adding to cart
        shopifyClientRef.current = client;

        window.ShopifyBuy.UI.onReady(client).then(function (ui) {
          // Final check before creating component
          if (isInitializedRef.current) {
            return;
          }

          // Store UI reference for cart operations
          shopifyUIRef.current = ui;

          const node = document.getElementById(nodeId);
          
          if (!node) {
            console.error('Shopify node not found');
            return;
          }

          // Clear any existing content
          node.innerHTML = '';

          // Destroy previous component if it exists
          if (shopifyComponentRef.current) {
            try {
              shopifyComponentRef.current.destroy();
            } catch {
              // Ignore destroy errors
            }
            shopifyComponentRef.current = null;
          }

          // Mark as initialized before creating component
          isInitializedRef.current = true;

          // Create new component using the provided snippet configuration
          const component = ui.createComponent('product', {
            id: '10451169706322',
            node: node,
            moneyFormat: '%7B%7Bamount_with_comma_separator%7D%7D%20kr',
            options: {
              "product": {
                "styles": {
                  "product": {
                    "@media (min-width: 601px)": {
                      "max-width": "calc(25% - 20px)",
                      "margin-left": "20px",
                      "margin-bottom": "50px"
                    }
                  },
                  "button": {
                    "font-size": "18px",
                    "padding-top": "17px",
                    "padding-bottom": "17px",
                    ":hover": {
                      "background-color": "#000000"
                    },
                    "background-color": "#000000",
                    ":focus": {
                      "background-color": "#000000"
                    },
                    "border-radius": "0px",
                    "padding-left": "100px",
                    "padding-right": "100px"
                  },
                  "quantityInput": {
                    "font-size": "18px",
                    "padding-top": "17px",
                    "padding-bottom": "17px"
                  }
                },
                "contents": {
                  "img": false,
                  "title": false,
                  "price": false
                },
                "text": {
                  "button": "Add to cart"
                }
              },
              "productSet": {
                "styles": {
                  "products": {
                    "@media (min-width: 601px)": {
                      "margin-left": "-20px"
                    }
                  }
                }
              },
              "modalProduct": {
                "contents": {
                  "img": false,
                  "imgWithCarousel": true,
                  "button": false,
                  "buttonWithQuantity": true
                },
                "styles": {
                  "product": {
                    "@media (min-width: 601px)": {
                      "max-width": "100%",
                      "margin-left": "0px",
                      "margin-bottom": "0px"
                    }
                  },
                  "button": {
                    "font-size": "18px",
                    "padding-top": "17px",
                    "padding-bottom": "17px",
                    ":hover": {
                      "background-color": "#000000"
                    },
                    "background-color": "#000000",
                    ":focus": {
                      "background-color": "#000000"
                    },
                    "border-radius": "0px",
                    "padding-left": "100px",
                    "padding-right": "100px"
                  },
                  "quantityInput": {
                    "font-size": "18px",
                    "padding-top": "17px",
                    "padding-bottom": "17px"
                  }
                },
                "text": {
                  "button": "Add to cart"
                }
              },
              "option": {},
              "cart": {
                "styles": {
                  "button": {
                    "font-size": "18px",
                    "padding-top": "17px",
                    "padding-bottom": "17px",
                    ":hover": {
                      "background-color": "#000000"
                    },
                    "background-color": "#000000",
                    ":focus": {
                      "background-color": "#000000"
                    },
                    "border-radius": "0px"
                  }
                },
                "text": {
                  "total": "Subtotal",
                  "button": "Checkout"
                }
              },
              "toggle": {
                "styles": {
                  "toggle": {
                    "background-color": "#000000",
                    ":hover": {
                      "background-color": "#000000"
                    },
                    ":focus": {
                      "background-color": "#000000"
                    }
                  },
                  "count": {
                    "font-size": "18px"
                  }
                }
              }
            },
          });
          
          // Store component reference for cleanup
          shopifyComponentRef.current = component;
          
          // Wait a bit for the button to render, then mark as ready
          setTimeout(() => {
            setShopifyButtonReady(true);
          }, 500);
        });
      }
    }

    function loadScript() {
      if (window.ShopifyBuy) {
        if (window.ShopifyBuy.UI) {
          ShopifyBuyInit();
        } else {
          const script = document.createElement('script');
          script.async = true;
          script.src = scriptURL;
          (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
          script.onload = ShopifyBuyInit;
        }
      } else {
        const script = document.createElement('script');
        script.async = true;
        script.src = scriptURL;
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
        script.onload = ShopifyBuyInit;
      }
    }

    loadScript();

    // Cleanup function
    return () => {
      // Reset initialization flag
      isInitializedRef.current = false;

      // Destroy Shopify component if it exists
      if (shopifyComponentRef.current) {
        try {
          shopifyComponentRef.current.destroy();
        } catch {
          // Ignore destroy errors
        }
        shopifyComponentRef.current = null;
      }
      
      // Clear the DOM node
      const node = document.getElementById(nodeId);
      if (node) {
        node.innerHTML = '';
      }
    };
  }, []);

  // Ensure video plays
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      video.play().catch(error => {
        console.log('Video autoplay prevented:', error);
      });
    };

    const handleError = (e) => {
      console.error('Video loading error:', e);
      console.error('Video source:', video.src || video.querySelector('source')?.src);
    };

    // Wait for video to be ready before playing
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    // Also try to play if already loaded
    if (video.readyState >= 3) {
      video.play().catch(error => {
        console.log('Video autoplay prevented:', error);
      });
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full p-4 min-h-[400px]">
      {/* Spinning Vinyl Video */}
      <div className="mb-4 flex justify-center items-center">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="max-w-[300px] max-h-[200px] md:max-h-[300px] w-full h-auto rounded-lg"
        >
          <source src="/kundovinylgif.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      {/* Product Name */}
      <div className="mb-2 flex justify-center items-center">
        <div className="text-xl sm:text-2xl font-bold font-['Courier_Prime'] tracking-wider">
          24 Vinyl
        </div>
      </div>
      
      {/* Price Display */}
      <div className="mb-2 flex justify-center items-center">
        <div className="text-lg sm:text-xl font-bold font-['Courier_Prime'] tracking-wider">
          249 kr
        </div>
      </div>
      
      {/* Shopify Buy Button */}
      <div className="w-full min-h-[100px] flex justify-center items-center relative overflow-visible">
        {/* Hidden Shopify Button */}
        <div id={nodeId} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', zIndex: -1 }}>
          <style>{`
            #${nodeId} {
              position: absolute !important;
              opacity: 0 !important;
              pointer-events: none !important;
              z-index: -1 !important;
              width: 0 !important;
              height: 0 !important;
              overflow: hidden !important;
            }
            #${nodeId} iframe {
              display: none !important;
            }
          `}</style>
        </div>
        
        {/* Custom Button */}
        <style>{`
          .custom-shopify-button {
            padding-top: 8px !important;
            padding-bottom: 8px !important;
            padding-left: 40px !important;
            padding-right: 40px !important;
            height: auto !important;
            min-height: unset !important;
            line-height: 1.4 !important;
          }
        `}</style>
        <button
          className="custom-shopify-button"
          onClick={async () => {
            if (shopifyButtonReady && shopifyClientRef.current) {
              try {
                // Function to find and click cart toggle
                const openCart = () => {
                  // Try multiple selectors and methods
                  const selectors = [
                    '.shopify-buy__cart-toggle',
                    '[data-shopify-buy-toggle]',
                    '.shopify-buy__btn--cart-toggle',
                    '[aria-label*="cart" i]',
                    '[aria-label*="Cart" i]',
                    'button[class*="cart"]',
                    '[class*="cart-toggle"]',
                    '[id*="cart-toggle"]',
                    '[id*="cartToggle"]'
                  ];
                  
                  // Search in main document
                  for (const selector of selectors) {
                    const element = document.querySelector(selector);
                    if (element && element.offsetParent !== null) { // Check if visible
                      element.click();
                      return true;
                    }
                  }
                  
                  // Search in all iframes
                  const iframes = document.querySelectorAll('iframe');
                  for (const iframe of iframes) {
                    try {
                      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                      for (const selector of selectors) {
                        const element = iframeDoc?.querySelector(selector);
                        if (element && element.offsetParent !== null) {
                          element.click();
                          return true;
                        }
                      }
                    } catch {
                      // Cross-origin, try postMessage
                      iframe.contentWindow?.postMessage({ type: 'shopify-buy-cart-toggle', action: 'open' }, '*');
                    }
                  }
                  
                  return false;
                };
                
                // Try to find and click the Shopify button first
                const shopifyButton = document.querySelector(`#${nodeId} .shopify-buy__btn, #${nodeId} .shopify-buy__btn-wrapper button, #${nodeId} button`);
                if (shopifyButton) {
                  // Create a more realistic click event
                  const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                  });
                  shopifyButton.dispatchEvent(clickEvent);
                  
                  // Also try regular click
                  shopifyButton.click();
                  
                  // Try to open cart multiple times with increasing delays
                  const tryOpenCart = (attempt = 0) => {
                    if (attempt < 5) {
                      setTimeout(() => {
                        if (!openCart()) {
                          tryOpenCart(attempt + 1);
                        }
                      }, 200 + (attempt * 100));
                    }
                  };
                  
                  tryOpenCart();
                  return;
                }

                // If button not found, try accessing iframe
                const iframe = document.querySelector(`#${nodeId} iframe`);
                if (iframe) {
                  // Post message to iframe to trigger button click
                  iframe.contentWindow?.postMessage({ type: 'shopify-buy-button-click' }, '*');
                  
                  // Also try direct click if accessible
                  try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    const iframeButton = iframeDoc?.querySelector('.shopify-buy__btn, button');
                    if (iframeButton) {
                      iframeButton.click();
                      
                      // Try to open cart
                      const tryOpenCart = (attempt = 0) => {
                        if (attempt < 5) {
                          setTimeout(() => {
                            if (!openCart()) {
                              tryOpenCart(attempt + 1);
                            }
                          }, 200 + (attempt * 100));
                        }
                      };
                      
                      tryOpenCart();
                    }
                  } catch {
                    // Cross-origin restriction, use postMessage
                    console.log('Using postMessage to trigger button');
                    
                    // Try to open cart anyway
                    setTimeout(() => {
                      openCart();
                    }, 500);
                  }
                }
              } catch (error) {
                console.error('Error triggering Shopify button:', error);
              }
            }
          }}
          style={{
            fontFamily: "'Courier Prime', 'Courier New', monospace",
            borderRadius: '0px',
            WebkitAppearance: 'none',
            boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            paddingTop: '8px',
            paddingBottom: '8px',
            paddingLeft: '40px',
            paddingRight: '40px',
            height: 'auto',
            minHeight: 'unset',
            lineHeight: '1.4',
            backgroundColor: '#000000',
            color: '#00ff00',
            border: '1px solid #00ff00',
            outline: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#00ff00';
            e.target.style.color = '#000000';
            e.target.style.borderColor = '#00ff00';
            e.target.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#000000';
            e.target.style.color = '#00ff00';
            e.target.style.borderColor = '#00ff00';
            e.target.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
          }}
          onFocus={(e) => {
            e.target.style.backgroundColor = '#00ff00';
            e.target.style.color = '#000000';
            e.target.style.borderColor = '#00ff00';
            e.target.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.7)';
          }}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ShopifyShopNew;

