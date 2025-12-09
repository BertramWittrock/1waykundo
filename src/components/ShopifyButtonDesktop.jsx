import { useEffect, useRef } from 'react';

const ShopifyShop = () => {
  const shopifyComponentRef = useRef(null);
  const nodeIdRef = useRef(`product-component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const isInitializedRef = useRef(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Prevent double initialization
    if (isInitializedRef.current) {
      return;
    }

    const scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
    const nodeId = nodeIdRef.current;

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

        window.ShopifyBuy.UI.onReady(client).then(function (ui) {
          // Final check before creating component
          if (isInitializedRef.current) {
            return;
          }

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

          // Create new component and store reference
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
                    ":hover": {
                      "background-color": "#00ff00",
                      "color": "#000000",
                      "border-color": "#00ff00",
                      "box-shadow": "0 0 10px rgba(0, 255, 0, 0.5)"
                    },
                    "background-color": "#000000",
                    "color": "#00ff00",
                    "border": "1px solid #00ff00",
                    "border-radius": "0px",
                    "font-family": "'Courier Prime', 'Courier New', monospace",
                    "font-weight": "700",
                    "text-transform": "uppercase",
                    "letter-spacing": "2px",
                    ":focus": {
                      "background-color": "#00ff00",
                      "color": "#000000",
                      "border-color": "#00ff00",
                      "box-shadow": "0 0 15px rgba(0, 255, 0, 0.7)"
                    }
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
                    ":hover": {
                      "background-color": "#00ff00",
                      "color": "#000000",
                      "border-color": "#00ff00",
                      "box-shadow": "0 0 10px rgba(0, 255, 0, 0.5)"
                    },
                    "background-color": "#000000",
                    "color": "#00ff00",
                    "border": "1px solid #00ff00",
                    "border-radius": "0px",
                    "font-family": "'Courier Prime', 'Courier New', monospace",
                    "font-weight": "700",
                    "text-transform": "uppercase",
                    "letter-spacing": "2px",
                    ":focus": {
                      "background-color": "#00ff00",
                      "color": "#000000",
                      "border-color": "#00ff00",
                      "box-shadow": "0 0 15px rgba(0, 255, 0, 0.7)"
                    }
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
                    ":hover": {
                      "background-color": "#00ff00",
                      "color": "#000000",
                      "border-color": "#00ff00",
                      "box-shadow": "0 0 10px rgba(0, 255, 0, 0.5)"
                    },
                    "background-color": "#000000",
                    "color": "#00ff00",
                    "border": "1px solid #00ff00",
                    "border-radius": "0px",
                    "font-family": "'Courier Prime', 'Courier New', monospace",
                    "font-weight": "700",
                    "text-transform": "uppercase",
                    "letter-spacing": "2px",
                    ":focus": {
                      "background-color": "#00ff00",
                      "color": "#000000",
                      "border-color": "#00ff00",
                      "box-shadow": "0 0 15px rgba(0, 255, 0, 0.7)"
                    }
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
                    "border": "1px solid #00ff00",
                    "color": "#00ff00",
                    ":hover": {
                      "background-color": "#00ff00",
                      "color": "#000000",
                      "box-shadow": "0 0 10px rgba(0, 255, 0, 0.5)"
                    },
                    ":focus": {
                      "background-color": "#00ff00",
                      "color": "#000000",
                      "box-shadow": "0 0 15px rgba(0, 255, 0, 0.7)"
                    }
                  }
                }
              }
            },
          });
          
          // Store component reference for cleanup
          shopifyComponentRef.current = component;
        });
      }
    }

    function loadScript() {
      // Check if script is already loaded
      const existingScript = document.querySelector(`script[src="${scriptURL}"]`);
      
      if (existingScript) {
        // Script already exists, just initialize
        if (window.ShopifyBuy && window.ShopifyBuy.UI) {
          ShopifyBuyInit();
        } else {
          // Wait for script to finish loading
          existingScript.addEventListener('load', ShopifyBuyInit);
        }
      } else if (window.ShopifyBuy) {
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
          className="max-w-[300px] max-h-[300px] w-full h-auto rounded-lg"
        >
          <source src="/kundovinylgif.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Product Name */}
      <div className="mb-2 flex justify-center items-center">
        <div className="text-[#00ff00] text-xl sm:text-2xl font-bold font-['Courier_Prime'] tracking-wider">
          24 Vinyl
        </div>
      </div>
      
      {/* Price Display */}
      <div className="mb-2 flex justify-center items-center">
        <div className="text-[#00ff00] text-lg sm:text-xl font-bold font-['Courier_Prime'] tracking-wider">
          249 kr
        </div>
      </div>
      
      {/* Shopify Buy Button */}
      <div className="w-full min-h-[100px] flex justify-center relative overflow-visible">
        <div 
          id={nodeIdRef.current} 
          className="shopify-button-wrapper relative z-10"
          style={{
            fontFamily: "'Courier Prime', 'Courier New', monospace"
          }}
        >
          <style>{`
            .shopify-button-wrapper {
              background-color: transparent !important;
              position: relative !important;
              overflow: visible !important;
              display: inline-block !important;
            }
            .shopify-button-wrapper::before {
              display: none !important;
            }
            .shopify-button-wrapper iframe {
              background-color: transparent !important;
              border: 1px solid #00ff00 !important;
              border-radius: 0px !important;
              display: block !important;
              position: relative !important;
              z-index: 1 !important;
            }
            .shopify-button-wrapper button {
              font-family: 'Courier Prime', 'Courier New', monospace !important;
              font-weight: 700 !important;
              text-transform: uppercase !important;
              letter-spacing: 2px !important;
            }
            #${nodeIdRef.current} {
              background-color: transparent !important;
              display: inline-block !important;
            }
            #${nodeIdRef.current} > * {
              background-color: transparent !important;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default ShopifyShop;

