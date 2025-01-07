import { useTypedDispatch } from "@Store/hooks";
import { NavLink, useNavigate } from "react-router-dom";
import { navigationLinks } from "@Constants/index";
import { Button } from "@Components/RadixComponents/Button";
import { toggleModal } from "@Store/actions/common";
import Icon from "../Icon";
import { FlexRow } from "../Layouts";
import ToggledNavbar from "./ToggledNavbar";
import { useRef } from "react";

export default function Navbar() {
  const dispatch = useTypedDispatch();
  const navigate = useNavigate();
  const mobileViewNav = useRef<HTMLElement | null>(null);

  return (
    <nav className="naxatw-bg-primary naxatw-sticky naxatw-top-0 naxatw-z-10">
      <nav className="naxatw-container naxatw-py-3">
        <FlexRow className="naxatw-items-center naxatw-justify-between">
          <FlexRow className="naxatw-text-white naxatw-items-center" gap={2}>
            <Icon name="public" />
            <div
              className="naxatw-cursor-pointer"
              role="presentation"
              onClick={() => navigate("/")}
            >
              <h3 className="naxatw-text-white naxatw-font-medium">GeoSewa</h3>
            </div>
          </FlexRow>
          <FlexRow className="naxatw-hidden md:naxatw-flex naxatw-gap-4 naxatw-mt-1 naxatw-text-white">
            {navigationLinks.map((nav) => (
              <NavLink
                key={nav.path}
                to={nav.path}
                className={({ isActive }) =>
                  `${
                    isActive && "naxatw-text-red-500"
                  } naxatw-px-3 naxatw-py-2 naxatw-tracking-wide naxatw-text-[1rem] hover:naxatw-text-red-500`
                }
              >
                {nav.label}
              </NavLink>
            ))}
          </FlexRow>
          <FlexRow
            className="naxatw-hidden md:naxatw-flex naxatw-items-center"
            gap={2}
          >
            <Button
              variant="outline"
              className="naxatw-w-24 naxatw-text-body-lg"
              onClick={() => dispatch(toggleModal("login"))}
            >
              Login
            </Button>
            <Button
              variant="default"
              className="naxatw-w-24 naxatw-border !naxatw-border-white naxatw-text-body-lg hover:naxatw-bg-white hover:naxatw-text-primary"
              onClick={() => dispatch(toggleModal("sign-up"))}
            >
              Sign Up
            </Button>
          </FlexRow>
          <ToggledNavbar
            navItems={navigationLinks}
            mobileViewNavRef={mobileViewNav}
          />
        </FlexRow>
      </nav>
    </nav>
  );
}
