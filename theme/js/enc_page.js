function init_enc_page()
{
    //<body OnLoad="document.myform.mytextfield.focus();">

        var strip_padding = function (padded_content, padding_char) {
            /*
             * Strips the padding character from decrypted content.
             */
            for (var i = padded_content.length; i > 0; i--) {
                if (padded_content[i - 1] !== padding_char) {
                    return padded_content.slice(0, i);
                }
            }
        };

        var decrypt_content = function (password, iv_b64, ciphertext_b64, padding_char) {
            /*
             * Decrypts the content from the ciphertext bundle.
             */
            var key = CryptoJS.MD5(password),
                iv = CryptoJS.enc.Base64.parse(iv_b64),
                ciphertext = CryptoJS.enc.Base64.parse(ciphertext_b64),
                bundle = {
                    key: key,
                    iv: iv,
                    ciphertext: ciphertext
                };

            var plaintext = CryptoJS.AES.decrypt(bundle, key, { iv: iv, padding: CryptoJS.pad.NoPadding });

            try {
                return strip_padding(plaintext.toString(CryptoJS.enc.Utf8), padding_char);
            }
            catch (err) {
                // encoding failed; wrong password
                return false;
            }
        };

        var init_decryptor = function () {
            var decrypt_btn = document.getElementById('pec-decrypt-content'),
                password_input = document.getElementById('pec-content-password'),
                encrypted_content = document.getElementById('pec-encrypted-content'),
                decrypted_content = document.getElementById('pec-decrypted-content'),
                decrypt_form = document.getElementById('pec-decrypt-form');

    

            decrypt_btn.addEventListener('click', function () {
                // grab the ciphertext bundle
                var parts = encrypted_content.innerHTML.split(';');

                // decrypt it
                var content = decrypt_content(
                    password_input.value,
                    parts[0],
                    parts[1],
                    parts[2]
                );

                if (content) {
                    // success; display the decrypted content
                    decrypted_content.innerHTML = content;
                    decrypt_form.parentNode.removeChild(decrypt_form);
                    encrypted_content.parentNode.removeChild(encrypted_content);

                    // any post processing on the decrypted content should be done here
                }
                else {
                    // ¯\_(ツ)_/¯
                    password_input.value = '';
                }
            });

            // pree buttun by enter
            password_input.addEventListener("keyup", event => {
                if(event.key !== "Enter") return; 
                decrypt_btn.click();
                event.preventDefault();
            });

            // ready to pass
            password_input.focus();

        };

        document.addEventListener('DOMContentLoaded', init_decryptor);
}
