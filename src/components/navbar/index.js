import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

function Navbar() {
  return (
    <ul className={styles.list}>
      <li className={styles.item}>
        <Link to="/" className={styles.item}>Home</Link>
      </li>
      <li className={styles.item}>
        <Link to="/multiplosclientes" className={styles.item}>Multiplos Clientes</Link>
      </li>
      <li className={styles.item}>
        <Link to="/calculosanalises" className={styles.item}>Análises</Link>
      </li>
    </ul>
  )
}

export default Navbar