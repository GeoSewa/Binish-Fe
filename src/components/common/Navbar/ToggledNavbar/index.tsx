import { useTypedSelector } from "@Store/hooks";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import NavDropDownMenu from "../NavDropdownMenu";
import { setToggleNavbar } from "@Store/actions/common";
import Icon from "@Components/common/Icon";
import { Button } from "@Components/RadixComponents/Button";

interface IToggledNavbarProps {
  navItems: Record<string, any>;
  mobileViewNavRef: any;
  isAuthenticated?: boolean;
  username?: string | null;
  onLogin?: () => void;
  onSignUp?: () => void;
  onLogout?: () => void;
}

const ToggledNavbar = ({ navItems, mobileViewNavRef, isAuthenticated, username, onLogin, onSignUp, onLogout }: IToggledNavbarProps) => {
  const dispatch = useDispatch();
  const toggleNavbar = useTypedSelector((state) => state.common.navbarToggled);

  // toggle menu items
  const handleToggle = () => {
    if (toggleNavbar) {
      document.body.style.overflow = "auto";
      mobileViewNavRef?.current?.classList?.remove("nav-open");
    } else {
      document.body.style.overflow = "hidden";
      mobileViewNavRef?.current?.classList?.add("nav-open");
    }
    dispatch(setToggleNavbar(!toggleNavbar));
  };

  return (
    <div className="mobile-view-navbar">
      <button type="button" onClick={handleToggle} className="md:naxatw-hidden">
        {toggleNavbar ? (
          <div className="close-btn naxatw-mt-2 naxatw-flex naxatw-cursor-pointer naxatw-items-center">
            <Icon name="close" className="naxatw-text-white naxatw-text-2xl" />
          </div>
        ) : (
          <div className="naxatw-flex naxatw-mt-2 naxatw-cursor-pointer naxatw-items-center">
            <Icon name="menu" className="naxatw-text-white naxatw-text-2xl" />
          </div>
        )}
      </button>

      {toggleNavbar && (
        <nav
          className="primary-navigation naxatw-fixed naxatw-inset-x-0 naxatw-bottom-0 naxatw-top-[70px] naxatw-z-[99] naxatw-block naxatw-bg-[#FBF8F3] md:naxatw-hidden"
          ref={mobileViewNavRef}
        >
          <div className="naxatw-flex naxatw-h-full naxatw-flex-col">
            <div className="naxatw-flex naxatw-flex-1 naxatw-flex-col naxatw-px-4 naxatw-pt-5">
              {navItems?.map((nav: Record<string, any>) => {
                return nav?.children ? (
                  <NavDropDownMenu subLinks={nav} key={nav.id} />
                ) : (
                  <NavLink
                    to={nav.path}
                    key={nav.path}
                    onClick={() => {
                      document.body.style.overflow = "auto";
                      dispatch(setToggleNavbar(false));
                    }}
                  >
                    <p className="naxatw-border-b naxatw-border-solid naxatw-border-b-[#D9D9D9] naxatw-py-4 naxatw-text-xl naxatw-font-medium naxatw-capitalize">
                      {nav.label}
                    </p>
                  </NavLink>
                );
              })}

              <div className="naxatw-mt-6 naxatw-space-y-3">
                {isAuthenticated ? (
                  <div className="naxatw-bg-white naxatw-rounded-lg naxatw-p-4 naxatw-shadow-sm">
                    <div className="naxatw-text-gray-700 naxatw-mb-3">{username}</div>
                    <Button
                      className="naxatw-w-full naxatw-bg-red-500 naxatw-text-white hover:naxatw-bg-red-600"
                      onClick={() => {
                        onLogout && onLogout();
                        document.body.style.overflow = "auto";
                        dispatch(setToggleNavbar(false));
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="naxatw-grid naxatw-grid-cols-2 naxatw-gap-3">
                    <Button
                      variant="outline"
                      className="naxatw-w-full"
                      onClick={() => {
                        onLogin && onLogin();
                        document.body.style.overflow = "auto";
                        dispatch(setToggleNavbar(false));
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="default"
                      className="naxatw-w-full"
                      onClick={() => {
                        onSignUp && onSignUp();
                        document.body.style.overflow = "auto";
                        dispatch(setToggleNavbar(false));
                      }}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <p className="naxatw-border-t naxatw-border-solid naxatw-border-t-[#EDEDED] naxatw-py-6 naxatw-text-center naxatw-text-base naxatw-leading-[1.575rem] naxatw-tracking-[-0.00563rem] naxatw-text-[#000]">
              © GeoSewa {new Date().getFullYear()}. All Rights Reserved.
            </p>
          </div>
        </nav>
      )}
    </div>
  );
};

export default ToggledNavbar;
