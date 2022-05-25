import { useAppState } from '../contexts/AppState'

const Navbar = () => {
  const [ state ] = useAppState()

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
      <a className='navbar-brand' href='/#'>
        DApp Token Exchange
      </a>
      <button
        className='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#navbarNavDropdown'
        aria-controls='navbarNavDropdown'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span className='navbar-toggler-icon'></span>
      </button>
      <ul className='navbar-nav ml-auto'>
        <li className='nav-item'>
          <a
            className='nav-link small'
            href={`https://etherscan.io/address/${state.account}`}
            target="_blank"
            rel="noreferrer"
          >
            {state.account}
          </a>
        </li>
      </ul>
      <div className='collapse navbar-collapse' id='navbarNavDropdown'>
      </div>
    </nav>
  )
}

export default Navbar