import { NavLink } from 'react-router-dom';

export function ShowCollection() {
  return (
    <ul className='flex flex-row'>
      <li>
        <NavLink
          className="header-menu-itemxxx "
          end
          // onClick={close}
          to={'/collections/'}
        >
          New Arrivals
        </NavLink>
      </li>
      <li>
        <NavLink
          className="header-menu-itemxx"
          end
          // onClick={close}
          to={'/collections/'}
        >
          Hot Items
        </NavLink>
      </li>
      {/* <li>
        <NavLink
          className="header-menu-item"
          end
          // onClick={close}
          to={'/collections/'}
        >
          All Collections
        </NavLink>
      </li> */}
    </ul>
  )
}
