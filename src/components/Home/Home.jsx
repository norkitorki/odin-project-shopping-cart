import styles from './Home.module.css';
import { Link } from 'react-router';

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.heading}>Welcome to my super awesome Shop!</h1>
      <Link to={'/shop'} className={styles.shopLink}>
        Go To Shop
      </Link>
    </div>
  );
}
