import Link from 'next/link';

const Header = () => (
  <header>
    <Link href="/">
      <a>Home</a>
    </Link>{' '}
    <Link href="/room">
      <a>Room</a>
    </Link>
  </header>
);

export default Header;
