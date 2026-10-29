# RSVPs

The invite's RSVP form sends each reply to [Web3Forms](https://web3forms.com), which emails it to
the couple. Guests see only a thank-you note. No phone number or email address appears on the
site: it carries only a Web3Forms access key, which is public by design.

The free plan covers 250 RSVPs a month.

## Set up (once, about 2 minutes)

1. Open https://web3forms.com, enter the email address that should receive RSVPs and click
   **Create Access Key**.
2. Web3Forms emails the key to that address. Check spam if it does not arrive.
3. Put the key in `RSVP_ACCESS_KEY` in `src/config.js` and redeploy the site.
4. Send one test RSVP from a phone and check that the email arrives.

## Each RSVP email

- **Subject:** `RSVP: Asha (attending, 3)` or `RSVP: Ravi (declined)`
- **Body:** Name, Attending, Guests and Message.

To keep a head count, add a mail filter or label for subjects that start with `RSVP:`.

## Spam

The form has a hidden honeypot checkbox that only bots tick, and Web3Forms drops those
submissions.
