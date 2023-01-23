import React from "react";
import { Link } from "react-router-dom";

const SubNavbar = (props) => {
  return (
    <>
      <div class="sub-header-container">
        <header class="header navbar navbar-expand-sm">
          <a href class="sidebarCollapse" data-placement="bottom">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-menu"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </a>
          <ul class="navbar-nav flex-row ml-auto ">
            <li class="nav-item more-dropdown">
              <div class="dropdown  custom-dropdown-icon">
                <Link
                  class="dropdown-toggle btn"
                  to="/admin/setting"
                  role="button"
                  id="customDropdown"
                  // data-toggle="dropdown"
                  // aria-haspopup="true"
                  // aria-expanded="false"
                >
                  <span style={{ fontWeight: 300 }}>Settings</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-settings"
                  >
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                </Link>

                {/* <div
                  class="dropdown-menu dropdown-menu-right"
                  aria-labelledby="customDropdown"
                >
                  <a class="dropdown-item" data-value="Settings" href>
                    Settings
                  </a>
                  <a class="dropdown-item" data-value="Mail" href>
                    Mail
                  </a>
                  <a class="dropdown-item" data-value="Print" href>
                    Print
                  </a>
                  <a class="dropdown-item" data-value="Download" href>
                    Download
                  </a>
                  <a class="dropdown-item" data-value="Share" href>
                    Share
                  </a>
                </div> */}
              </div>
            </li>
          </ul>
        </header>
      </div>
    </>
  );
};

export default SubNavbar;
