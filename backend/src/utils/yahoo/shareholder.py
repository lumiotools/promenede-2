import pandas as pd
import yfinance as yf
import json

def get_shareholder_info(ticker_symbol: str):
    """
    Fetches and formats shareholder data for a given stock ticker.

    Args:
        ticker_symbol (str): Stock ticker symbol (e.g., "AAPL", "TSLA").

    Returns:
        dict: Shareholder data in JSON-serializable format.
    """
    try:
        ticker = yf.Ticker(ticker_symbol)

        yahooData = {
            "major_holders": None,
            "institutional_holders": None
        }

        # Convert major holders (Series) to JSON-serializable dictionary
        if isinstance(ticker.major_holders, pd.DataFrame):
            yahooData["major_holders"] = ticker.major_holders.to_dict(orient="records")
        elif isinstance(ticker.major_holders, pd.Series):
            yahooData["major_holders"] = ticker.major_holders.to_dict()

        # Convert institutional holders (DataFrame) to JSON-serializable list
        if isinstance(ticker.institutional_holders, pd.DataFrame):
            yahooData["institutional_holders"] = ticker.institutional_holders.to_dict(orient="records")

            # Convert Timestamp fields to string format (Fix JSON Error)
            for holder in yahooData["institutional_holders"]:
                if "Date Reported" in holder and isinstance(holder["Date Reported"], pd.Timestamp):
                    holder["Date Reported"] = holder["Date Reported"].strftime('%Y-%m-%d')

        return yahooData

    except Exception as e:
        print(f"❌ Error fetching shareholder data: {e}")
        return None

# Example Usage:
# shareholder_data = get_shareholder_info("AAPL")

# # Convert to JSON string (now it works)
# json_output = json.dumps(shareholder_data, indent=4)
# print(json_output)
