const zumCallback = (Event: string) => {
  if (Event === "Started") {
    console.log("RENT TRANSACTION STARTED");
    const status = "INITIATED";

    console.log("STATUS: ", status);

    // Handling the response
    handleLandlordResponse(status);
  } else if (Event === "Succeeded") {
    console.log("RENT TRANSACTION SUCCEEDED");
    const status = "DEPOSITED";
    console.log("STATUS: ", status);

    // Handling the response
    handleLandlordResponse(status);
  } else if (
    /* The following code has a Miro structure to be found at: 
    https://miro.com/welcomeonboard/V1lJYTFQQzVzT05wVTdrQlFEbElNZU0xeHBnZk01QW5FUHVDdE92TUI3c05ON2x0S20yNzkwYUVnTjI5V0lySnwzNDU4NzY0NTU0MTYyNTY2MTc4fDI=?share_link_id=457163446247 
    
      High level structure: 
        Failed: 
          If transaction is failed due to not being reached, or authentication failing multiple times, or invalid email we want to capture those fail states, 
          We then set the status to Failed + Event, and call the handleLandlordResponse function
          
        Failed because Expired:
          If transaction is failed due to etransfer being expired, we set the status to EXPIRED and call the handleLandlordResponse function
  
    or contact Abhi
    */
    Event === "InteracFailedNotificationDeliveryFailure" ||
    Event === "InteracFailedAuthentication" ||
    Event === "InteracFailedInvalidEmailFormat"
  ) {
    // transaction failures due to invalid email, authentication, or notification delivery failure (unable to send email)
    console.log("RENT TRANSACTION FAILED");
    const status = "FAILED:" + Event; //set the status to Failed + Event, example: (Failed:InteracFailedNotificationDeliveryFailure)

    console.log("STATUS: ", status);

    // Handling the response
    handleLandlordResponse(status);
  } else if (
    //transaction failed due to expiry, set status to Expired
    Event === "InteracFailedReachedCancellationCutOff"
  ) {
    console.log("RENT TRANSACTION EXPIRED");
    const status = "EXPIRED";

    console.log("STATUS: ", status);

    handleLandlordResponse(status);
  } else if (
    Event === "Failed" ||
    Event === "UnderReview" ||
    Event === "CreditCardDeclined" ||
    Event === "CreditCardError" ||
    Event === "CreditCardGenericError" ||
    Event === "CreditCardAmountExceeded"
  ) {
    console.log("TRANSACTION FAILED");
  }
};

/*****************************************    HELPER FUNCTIONS   ************************************************************/

async function handleLandlordResponse(status: string) {
  const reason = status.split(":")[1] || null;
  let statusUpdate = "PENDING";
  switch (status.split(":")[0]) {
    case "INITIATED":
      statusUpdate = "PENDING";
      console.log();
      break;
    case "DEPOSITED":
      statusUpdate = "COMPLETED";
      console.log("email sent Completed");
      break;
    //Case for setting status to EXPIRED and sending email of expired transfer to user
    case "EXPIRED":
      statusUpdate = "EXPIRED";
      console.log("email sent expired");
      break;
    case "FAILED":
      statusUpdate = "FAILED";
      //switch case for different failure reasons and what email to send for those reasons, if no reason(InteracFailedNotificationDeliveryFailure), then set msgBody to null
      switch (reason) {
        case "InteracFailedInvalidEmailFormat":
          console.log("email sent invalid email");
          break;
        case "InteracFailedAuthentication":
          console.log("email sent failed authentication");
          break;
        default:
          console.log("no email sent failed");
      }
      break;
  }
  // if status is failed, then add a comment with the reason of failure
  if (statusUpdate === "FAILED") {
    console.log("Transaction failed comment updated");
  } else {
    console.log("Transaction failed comment not updated");
  }

  //Don't set/update invoice if transaction status is EXPIRED
  if (statusUpdate !== "EXPIRED") {
    console.log("Transaction expired");
  }

  //if expired and failed, message slack channel and give reason for failure or if expired then expired is the reason. Provide household id in question.
  if (statusUpdate === "FAILED" || statusUpdate === "EXPIRED") {
    let message = "";
    switch (statusUpdate) {
      case "EXPIRED":
        message = `TRANSACTION: - Expired - HOUSEHOLD ID: `;
        break;
      case "FAILED":
        message = `TRANSACTION:  - Failed with reason: ${reason} - HOUSEHOLD ID: `;
        break;
    }
    try {
      await console.log("NewChexyUsers", message);
    } catch (error) {
      console.error("Error sending Slack message:", error);
    }
  }
}

zumCallback("InteracFailedAuthentication");
