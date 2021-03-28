import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Pane } from 'evergreen-ui'

const NavbarStyles = styled.div`
  .navbar {
    position: fixed;
    display: flex;
    padding: 0.5rem;
    top: 0;
    z-index: 999;
    height: 48px;
    width: 100%;
    align-items: center;

    transition: all 0.2s ease-in;
  }

  .sticky {
    display: flex;
    top: 0;
    box-shadow: 0 0 1px rgba(67, 90, 111, 0.3),
      0 8px 10px -4px rgba(67, 90, 111, 0.47);

    & .header {
      opacity: 1;
    }
  }

  .header {
    width: 100%;
    height: 1.5rem;
    opacity: 0;
    white-space: nowrap;
    padding: 0 !important;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all 0.3s ease-in;

    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const Navbar = ({ children }) => {
  const navbar = useRef(null)
  const [sticky, setSticky] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setSticky(window.pageYOffset > 0)
    }
    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [navbar])

  return (
    <NavbarStyles>
      <Pane
        ref={navbar}
        className={{ sticky, navbar: true }}
        background="white"
      >
        {children}
      </Pane>
    </NavbarStyles>
  )
}

export default Navbar
