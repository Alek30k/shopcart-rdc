import Container from "./Container";
import HeaderMenu from "./HeaderMenu";
import Logo from "./Logo";

const Header = () => {
  return (
    <header className=" bg-white py-5 border-b border-b-black/20">
      <Container className="flex items-center justify-between">
        {/* Logo */}
        <Logo />
        {/* NavBotton */}
        <HeaderMenu />
        {/* NavAdmin */}
        <div className="">Others</div>
      </Container>
    </header>
  );
};

export default Header;
