        <footer>
            <div class="link-container">
                <div class="about">
                    <a href="#">About</a>
                </div>
                <div class="contact">
                    <a href="#">Contact us</a>
                </div>
            </div>
            <div class="copy-right">
                &copy; <?php echo date("Y");?> CU Sport Booking System. All Rights Reserved.
            </div>
        </footer>
        <script>
            $("input[type='number']").keydown( function(e) {
                // prevent: "e", "=", ",", "-", "."
                if ([69, 187, 188, 189, 190].includes(e.keyCode)) {
                    e.preventDefault();
                }
            });
        </script>
    </body>
</html>
