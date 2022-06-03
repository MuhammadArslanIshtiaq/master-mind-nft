/* This example requires Tailwind CSS v2.0+ */

import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function NavbarPrimary() {
  const [navbar, setNavbar] = useState(false);

  const navigation = [
    { name: "About", href: "/about" },
    { name: "Presale", href: "/" },
    { name: "Charts", href: "/Charts" },
    { name: "Fund", href: "/Fund" },
    { name: "FAQ", href: "/FAQ" },
  ];

  const changeBackground = () => {
    if (window.scrollY >= 80) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  window.addEventListener("scroll", changeBackground);

  return (
    <Disclosure
      as="nav"
      className={`sticky w-full top-0 z-40 transition-all duration-300 ${navbar && "py-2 bg-black shadow-sm shadow-gray-400"
        }`}
    >
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-end lg:items-stretch lg:justify-start">
                <div className="flex-shrink-0 flex items-center animated fadeInLeftBig">
                  <img
                    className="block h-11 w-auto"
                    src="assets/images/logo.png"
                    alt="Workflow"
                  />
                </div>
                <div className="hidden lg:flex flex-1 justify-center items-center lg:ml-14">
                  <div className="flex space-x-8">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                          isActive
                            ? "text-primary font-normal text-[0.9rem] hover:opacity-90"
                            : "text-white hover:text-primary font-normal text-[0.9rem]"
                        }
                      >
                       
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 items-center pr-2 lg:static lg:inset-auto lg:ml-6 lg:pr-0 hidden lg:flex">
                {/* button on small */}
                <div className="flex items-center space-x-1">
                  <a
                    href="https://t.me/MastermindGroup.NFT"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition transform hover:scale-110 active:scale-110 focus:scale-110 duration-200"
                  >
                    <span className="block h-9 w-9">
                      <img
                        className="block h-100 w-100"
                        src="/assets/images/icon-4.png"
                        alt=".."
                      />
                    </span>
                  </a>
                  <a
                    href="https://www.twitter.com/MMGroupNFT"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition transform hover:scale-110 active:scale-110 focus:scale-110 duration-200"
                  >
                    <span className="block h-10 w-10">
                      <img
                        className="block h-100 w-100"
                        src="/assets/images/icon-2.png"
                        alt=".."
                      />
                    </span>
                  </a>
                  <a
                    href="https://www.instagram.com/mastermindgroup.nft"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition transform hover:scale-110 active:scale-110 focus:scale-110 duration-200"
                  >
                    <span className="block h-9 w-9">
                      <img
                        className="block h-100 w-100"
                        src="/assets/images/icon-5.png"
                        alt=".."
                      />
                    </span>
                  </a>
                  <a
                    href="https://opensea.io/collection/mastermind-group-nft"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition transform hover:scale-110 active:scale-110 focus:scale-110 duration-200"
                  >
                    <span className="block h-10 w-10">
                      <img
                        className="block h-100 w-100"
                        src="/assets/images/icon-3.png"
                        alt=".."
                      />
                    </span>
                  </a>
                </div>
                {/* == */}
                
              </div>
            </div>
          </div>

          <Disclosure.Panel className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-ebony-500">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={NavLink}
                  to={item.href}
                  className={({ isActive }) =>
                    isActive
                      ? "bg-black text-primary hover:opacity-90 block px-3 py-2 rounded-md text-base font-medium"
                      : "text-gray-300 hover:bg-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  }
                >
                 
                </Disclosure.Button>
              ))}
             
              <Disclosure.Button as="div">
                <div className="mt-3 flex items-center space-x-1">
                  <a
                    href="https://discord.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition transform hover:scale-110 active:scale-110 focus:scale-110 duration-200"
                  >
                    <span className="block h-10 w-10">
                      <img
                        className="block h-100 w-100"
                        src="/assets/images/icon-1.png"
                        alt=".."
                      />
                    </span>
                  </a>
                  <a
                    href="https://twitter.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition transform hover:scale-110 active:scale-110 focus:scale-110 duration-200"
                  >
                    <span className="block h-10 w-10">
                      <img
                        className="block h-100 w-100"
                        src="/assets/images/icon-2.png"
                        alt=".."
                      />
                    </span>
                  </a>
                  <button
                    type="button"
                    className="transition transform hover:scale-110 active:scale-110 focus:scale-110 duration-200"
                  >
                    <span className="block h-10 w-10">
                      <img
                        className="block h-100 w-100"
                        src="/assets/images/icon-3.png"
                        alt=".."
                      />
                    </span>
                  </button>
                </div>
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
