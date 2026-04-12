import Header from './Header';
import Footer from './Footer';

const PageLayout = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
  </>
);

export default PageLayout;