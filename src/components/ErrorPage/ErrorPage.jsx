import styles from './ErrorPage.module.css';
import { Link, useRouteError } from 'react-router';

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.status}>
        {error.status}: {error.statusText}
      </h2>
      <p className={styles.message}>{error.data}</p>
      <Link to="/">Go Back Home</Link>
    </div>
  );
}
