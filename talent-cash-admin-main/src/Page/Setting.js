import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";

//Multi Select Dropdown
import Multiselect from "multiselect-react-dropdown";

// action
import {
  getSetting,
  updateSetting,
  handleSwitch,
} from "../Store/setting/setting.action";
import { permissionError } from "../util/Alert";

//jquery
import $ from "jquery";

const Setting = (props) => {
  // disable mousewheel on a input number field when in focus
  // (to prevent Chromium browsers change the value when scrolling)
  $("form").on("focus", "input[type=number]", function (e) {
    $(this).on("wheel.disableScroll", function (e) {
      e.preventDefault();
    });
  });
  $("form").on("blur", "input[type=number]", function (e) {
    $(this).off("wheel.disableScroll");
  });

  const [mongoId, setMongoId] = useState("");
  const [privacyPolicyLink, setPrivacyPolicyLink] = useState("");
  const [privacyPolicyText, setPrivacyPolicyText] = useState("");
  const [googlePlayEmail, setGooglePlayEmail] = useState("");
  const [googlePlayKey, setGooglePlayKey] = useState("");
  const [stripePublishableKey, setStripePublishableKey] = useState("");
  const [stripeSecretKey, setStripeSecretKey] = useState("");
  const [currency, setCurrency] = useState("$");
  const [minDiamondForCashOut, setMinDiamondForCashOut] = useState(0);
  const [diamondPerCurrency, setDiamondPerCurrency] = useState(0);
  const [CoinForDiamond, setCoinForDiamond] = useState(0);
  const [maxSecondForVideo, setMaxSecondForVideo] = useState(0);
  const [freeCoinForAdd, setFreeCoinForAdd] = useState(0);
  const [maxAdPerDay, setMaxAdPerDay] = useState(0);

  const [googlePlaySwitch, setGooglePlaySwitch] = useState(false);
  const [stripeSwitch, setStripeSwitch] = useState(false);
  const [isAppActive, setIsAppActive] = useState(false);

  const [paymentGateway, setPaymentGateway] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [errors, setError] = useState({
    maxSecondForVideo: "",
    CoinForDiamond: "",
    minDiamondForCashOut: "",
    freeCoinForAddVAlid: "",
    maxAdPerDay: "",
    diamondPerCurrency: "",
  });

  useEffect(() => {
    props.getSetting(); // eslint-disable-next-line
  }, []);

  const setting = useSelector((state) => state.setting.setting);
  const hasPermission = useSelector((state) => state.admin.user.flag);

  useEffect(() => {
    setError({
      maxSecondForVideo: "",
      CoinForDiamond: "",
      minDiamondForCashOut: "",
      maxAdPerDay: "",
      diamondPerCurrency: "",
    });
    if (setting) {
      const data = setting?.paymentGateway?.map((data) => {
        return {
          name: data,
        };
      });

      setMongoId(setting._id);

      setMaxSecondForVideo(setting.maxSecondForVideo);
      setPrivacyPolicyLink(setting.privacyPolicyLink);
      setPrivacyPolicyText(setting.privacyPolicyText);

      setGooglePlayEmail(setting.googlePlayEmail);
      setGooglePlayKey(setting.googlePlayKey);
      setStripePublishableKey(setting.stripePublishableKey);
      setStripeSecretKey(setting.stripeSecretKey);
      setCurrency(setting.currency);

      setCoinForDiamond(setting.CoinForDiamond);
      setGooglePlaySwitch(setting.googlePlaySwitch);
      setStripeSwitch(setting.stripeSwitch);
      setIsAppActive(setting.isAppActive);

      setMinDiamondForCashOut(setting.minDiamondForCashOut);
      setDiamondPerCurrency(setting.diamondPerCurrency);
      setFreeCoinForAdd(setting.freeCoinForAd);
      setMaxAdPerDay(setting.maxAdPerDay);
      setPaymentGateway(setting?.paymentGateway);

      setSelectedValue(data);
    }
  }, [setting]);

  const handleSubmit = () => {
    const maxSecondForVideoValid = isNumeric(maxSecondForVideo);
    if (!maxSecondForVideoValid) {
      return setError({
        ...errors,
        maxSecondForVideo: "Invalid Value!!",
      });
    }

    const CoinForDiamondValid = isNumeric(CoinForDiamond);
    if (!CoinForDiamondValid) {
      return setError({
        ...errors,
        CoinForDiamond: "Invalid Value!!",
      });
    }

    // const freeCoinForAddVAlid = isNumeric(freeCoinForAdd);
    // if (!freeCoinForAddVAlid) {
    //   return setError({
    //     ...errors,
    //     freeCoinForAdd: "Invalid Value!!",
    //   });
    // }

    const maxAdPerDayVAlid = isNumeric(maxAdPerDay);
    if (!maxAdPerDayVAlid) {
      return setError({
        ...errors,
        maxAdPerDay: "Invalid Value!!",
      });
    }

    // const minDiamondForCashOutValid = isNumeric(minDiamondForCashOut);
    // if (!minDiamondForCashOutValid) {
    //   return setError({
    //     ...errors,
    //     minDiamondForCashOut: "Invalid Value!!",
    //   });
    // }

    const diamondPerCurrencyValid = isNumeric(diamondPerCurrency);
    if (!diamondPerCurrencyValid) {
      return setError({
        ...errors,
        diamondPerCurrency: "Invalid Value!!",
      });
    }

    const data = {
      maxSecondForVideo: maxSecondForVideo === "" ? 0 : maxSecondForVideo,
      privacyPolicyLink,
      privacyPolicyText,
      googlePlayEmail,
      googlePlayKey,
      stripePublishableKey,
      stripeSecretKey,
      freeCoinForAd: freeCoinForAdd === "" ? 1 : freeCoinForAdd,
      maxAdPerDay: maxAdPerDay === "" ? 3 : maxAdPerDay,
      currency,
      minDiamondForCashOut:
        minDiamondForCashOut === "" ? 0 : minDiamondForCashOut,
      diamondPerCurrency: diamondPerCurrency === "" ? 0 : diamondPerCurrency,
      CoinForDiamond: CoinForDiamond === "" ? 10 : CoinForDiamond,
      paymentGateway,
    };

    if (!hasPermission) return permissionError();

    props.updateSetting(mongoId, data);
  };

  const handleSwitch_ = (type) => {
    if (!hasPermission) return permissionError();
    props.handleSwitch(mongoId, type);
  };

  //onselect function of selecting multiple values
  function onSelect(selectedList, selectedItem) {
    paymentGateway.push(selectedItem.name);
  }

  //onRemove function for remove multiple values
  function onRemove(selectedList, removedItem) {
    setPaymentGateway(selectedList.map((data) => data.name));
  }

  const isNumeric = (value) => {
    const val = value === "" ? 0 : value;
    const validNumber = /^\d+$/.test(val);
    return validNumber;
  };

  const option = [{ name: "UPI" }, { name: "Paytm" }, { name: "Banking" }];

  return (
    <>
      <div id="content" class="main-content">
        <div class="layout-px-spacing">
          <div className="row my-3">
            <div class="col-xl-6 col-md-6 col-sm-12 col-12">
              <h4>Setting</h4>
            </div>
            <div class="col-xl-6 col-md-6 col-sm-12 col-12 ">
              <div class="breadcrumb-four float-right">
                <ul class="breadcrumb">
                  <li>
                    <Link to="/admin/dashboard">
                      {" "}
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
                        class="feather feather-home"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    </Link>
                  </li>
                  <li class="active">
                    <a href="javscript:void(0);"> Setting</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row ">
            <div class="col-md-6 col-12">
              <div class="card">
                <div class="card-body">
                  <div class="row">
                    <div className="col-12">
                      <h5 class="card-title  ">Other Setting</h5>
                    </div>
                  </div>

                  <form>
                    <div class="mb-3 mt-3 row">
                      <div class="col-md-6">
                        <label for="referralBonus" class="form-label">
                          Free Coin For Add
                        </label>
                        <input
                          type="number"
                          class="form-control"
                          id="referralBonus"
                          value={freeCoinForAdd}
                          onChange={(e) => setFreeCoinForAdd(e.target.value)}
                        />
                        {errors.freeCoinForAdd && (
                          <div className="ml-2 mt-1">
                            {errors.freeCoinForAdd && (
                              <div className="pl-1 text__left">
                                <span className="text-red">
                                  {errors.freeCoinForAdd}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div class="col-md-6">
                        <label for="loginBonus" class="form-label">
                          Max Add Per Day
                        </label>
                        <input
                          type="number"
                          class="form-control"
                          id="loginBonus"
                          value={maxAdPerDay}
                          onChange={(e) => setMaxAdPerDay(e.target.value)}
                        />
                        {errors.maxAdPerDay && (
                          <div className="ml-2 mt-1">
                            {errors.loginBonus && (
                              <div className="pl-1 text__left">
                                <span className="text-red">
                                  {errors.maxAdPerDay}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div class="mb-3">
                      <label for="videoSecond" class="form-label">
                        Maximum Seconds for Video
                      </label>
                      <input
                        type="number"
                        class="form-control"
                        id="videoSecond"
                        value={maxSecondForVideo}
                        onChange={(e) => setMaxSecondForVideo(e.target.value)}
                      />
                      {errors.maxSecondForVideo && (
                        <div className="ml-2 mt-1">
                          {errors.maxSecondForVideo && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.maxSecondForVideo}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        class="btn text-white bg-submit-gradient"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-12 mt-sm-2">
              <div class="card">
                <div class="card-body">
                  <div class="row">
                    <div className="col-6">
                      <h5 class="card-title d-flex justify-content-between mb-3">
                        Is App Active
                      </h5>
                    </div>
                    <div className="col-6">
                      <label class="switch s-icons s-outline  s-outline-secondary float-right  mb-4 mr-2">
                        <input
                          type="checkbox"
                          checked={isAppActive}
                          onChange={() => handleSwitch_("app active")}
                        />
                        <span class="slider round"></span>
                      </label>
                    </div>
                  </div>
                  <form>
                    <div class="mb-3 ">
                      <label for="policyLink" class="form-label">
                        Privacy Policy Link
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="policyLink"
                        value={privacyPolicyLink}
                        onChange={(e) => setPrivacyPolicyLink(e.target.value)}
                      />
                    </div>
                    <div class="mb-3">
                      <label for="policyText" class="form-label">
                        Privacy Policy Text
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="policyText"
                        value={privacyPolicyText}
                        onChange={(e) => setPrivacyPolicyText(e.target.value)}
                      />
                    </div>
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        class="btn text-white bg-submit-gradient"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <h3 className="my-3">Payment Setting</h3>
          <div class="row">
            <div class="col-md-6 col-12">
              <div class="card">
                <div class="card-body">
                  <div class="row">
                    <div className="col-6">
                      <h5 class="card-title d-flex justify-content-between">
                        Google Play
                      </h5>
                    </div>
                    <div className="col-6">
                      <label class="switch s-icons s-outline  s-outline-secondary float-right  mb-4 mr-2">
                        <input
                          type="checkbox"
                          checked={googlePlaySwitch}
                          onChange={() => handleSwitch_("googlePlay")}
                        />
                        <span class="slider round"></span>
                      </label>
                    </div>
                  </div>

                  <form>
                    <div class="mb-3 row">
                      <div className="col-12">
                        <label for="googlePlayEmail" class="form-label">
                          Google Play Email
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="googlePlayEmail"
                          value={googlePlayEmail}
                          onChange={(e) => setGooglePlayEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div class="mb-3 row">
                      <div className="col-12">
                        <label for="key" class="form-label">
                          Key
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="key"
                          value={googlePlayKey}
                          onChange={(e) => setGooglePlayKey(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        class="btn text-white bg-submit-gradient"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-12 mt-sm-2">
              <div class="card">
                <div class="card-body">
                  <div className="row">
                    <div className="col-6">
                      <h5 class="card-title d-flex justify-content-between">
                        Stripe
                      </h5>
                    </div>
                    <div className="col-6">
                      <label class="switch s-icons s-outline  s-outline-secondary float-right  mb-4 mr-2">
                        <input
                          type="checkbox"
                          checked={stripeSwitch}
                          onChange={() => handleSwitch_("stripe")}
                        />
                        <span class="slider round"></span>
                      </label>
                    </div>
                  </div>
                  <form>
                    <div class="mb-3">
                      <label for="publishableKey" class="form-label">
                        Publishable Key
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="publishableKey"
                        value={stripePublishableKey}
                        onChange={(e) =>
                          setStripePublishableKey(e.target.value)
                        }
                      />
                    </div>
                    <div class="mb-3">
                      <label for="secretKey" class="form-label">
                        Secret Key
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="secretKey"
                        value={stripeSecretKey}
                        onChange={(e) => setStripeSecretKey(e.target.value)}
                      />
                    </div>
                  </form>
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      class="btn bg-submit-gradient text-white"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h3 className="my-3">Redeem Setting</h3>

          <div class="row mb-3">
            <div class="col-md-6 col-12">
              <div class="card">
                <div class="card-body">
                  <form>
                    <div class="mb-3">
                      <label for="googlePlayEmail" class="form-label">
                        Payment Gateway
                      </label>
                      <Multiselect
                        class="form-control"
                        options={option} // Options to display in the dropdown
                        selectedValues={selectedValue} // Preselected value to persist in dropdown
                        onSelect={onSelect} // Function will trigger on select event
                        onRemove={onRemove} // Function will trigger on remove event
                        displayValue="name" // Property name to display in the dropdown options
                      />
                    </div>

                    <div class="mb-3">
                      <label for="minRCoinForCaseOut" class="form-label">
                        Minimum Diamond for cash out
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="minRCoinForCaseOut"
                        value={minDiamondForCashOut}
                        onChange={(e) =>
                          setMinDiamondForCashOut(e.target.value)
                        }
                      />
                      {errors.minDiamondForCashOut && (
                        <div className="ml-2 mt-1">
                          {errors.minDiamondForCashOut && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.minDiamondForCashOut}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        class="btn text-white bg-submit-gradient"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {/* <div className="col-md-6 col-12 mt-sm-2">
              <div className="card">
                <div className="card-body">
                  <form>
                    <div class="mb-3">
                      <label for="callCharge" class="form-label">
                        Currency
                      </label>
                      <select
                        class="form-select form-control"
                        aria-label="Default select example"
                        value={currency}
                        onChange={(e) => {
                          setCurrency(e.target.value);
                        }}
                      >
                        <option value="Dollar($)" selected>
                          Dollar($)
                        </option>
                        <option value="Rupee(₹)">Rupee(₹)</option>
                      </select>
                    </div>

                    <div class="mb-3 row">
                      <div className="col-5">
                        <label for="rCoin" class="form-label">
                          Diamond Rate (cash out)
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="rCoin"
                          value={
                            currency === "Dollar($)"
                              ? "1 Dollar"
                              : currency === "Rupee(₹)" && "1 Rupee"
                            // : "1 GBP"
                          }
                          disabled
                        />
                      </div>
                      <div className="col-1 mt-5">=</div>
                      <div className="col-6">
                        <label for="rCoin" class="form-label">
                          How Many Diamond
                        </label>
                        <input
                          type="number"
                          class="form-control"
                          id="rCoin"
                          value={diamondPerCurrency}
                          onChange={(e) =>
                            setDiamondPerCurrency(e.target.value)
                          }
                        />
                        {errors.diamondPerCurrency && (
                          <div className="ml-2 mt-1">
                            {errors.diamondPerCurrency && (
                              <div className="pl-1 text__left">
                                <span className="text-red">
                                  {errors.diamondPerCurrency}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div class="mb-3 row">
                      <div className="col-5">
                        <label for="rCoin" class="form-label">
                          Diamond
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="rCoin"
                          value="1 Diamond"
                          disabled
                        />
                      </div>
                      <div className="col-1 mt-5">=</div>
                      <div className="col-6">
                        <label for="rCoin" class="form-label">
                          How Many Coin
                        </label>
                        <input
                          type="number"
                          class="form-control"
                          id="rCoin"
                          value={CoinForDiamond}
                          onChange={(e) => setCoinForDiamond(e.target.value)}
                        />
                        {errors.CoinForDiamond && (
                          <div className="ml-2 mt-1">
                            {errors.CoinForDiamond && (
                              <div className="pl-1 text__left">
                                <span className="text-red">
                                  {errors.CoinForDiamond}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      class="btn btn-danger "
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getSetting, handleSwitch, updateSetting })(
  Setting
);
