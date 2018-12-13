<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PagesController extends Controller
{
    //
    public function mainPage()
    {
      # code...
        return view('pages.main');
    };
    
    public function hourMapPage(){
        #code...
        return view('pages.hourmap');
    };

    public function dayMapPage(){
        #code...
        return view('pages.daymap');
    };
}
