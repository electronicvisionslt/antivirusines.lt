<?php
header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=3600');
echo file_get_contents('https://dkwffdnrailtqvrxiulw.supabase.co/functions/v1/sitemap');
