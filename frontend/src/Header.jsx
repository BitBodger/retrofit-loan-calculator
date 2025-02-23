function Header() {
  return(
    <div className='header-container'>
      <div className='header-logo-calculator-container'>
        <div className='ascii-art'>
          <p style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>
            ______________________{"\n"}
            |  _________________  |{"\n"}
            | | RETROFIT =  $$$ | |{"\n"}
            | |_________________| |{"\n"}
            |  ___ ___ ___   ___  |{"\n"}
            | | 7 | 8 | 9 | | + | |{"\n"}
            | |___|___|___| |___| |{"\n"}
            | | 4 | 5 | 6 | | - | |{"\n"}
            | |___|___|___| |___| |{"\n"}
            | | 1 | 2 | 3 | | x | |{"\n"}
            | |___|___|___| |___| |{"\n"}
            | | . | 0 | = | | / | |{"\n"}
            | |___|___|___| |___| |{"\n"}
            |_____________________|
          </p>
        </div>
                
        <div className='title'>
          <h1>Retrofit<br />Savings<br />Calculator</h1>
        </div>
      </div>

      <div className='tagline'>
        <h3>Where energy savings and loan repayments collide</h3>
      </div>
          
    </div>
  )
}

export default Header;