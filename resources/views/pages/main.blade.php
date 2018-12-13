@extends('layouts.layout')
@section('content')
<div class="container-fluid">
      <div class="row">
          <div class="col-sm-3">
              <div class="card text-center">
              <div class="card-body">
                  <h5 class="card-title">Earthquake Past Hour</h5>
                  <p class="card-text">Map showing Earthquake happening during past few hour. Data update every 5 minutes. </p>
                  <a href="/hourmap" class="btn btn-primary btn-block">Go to Map</a>
              </div>
              </div>
          </div>
          <div class="col-sm-3">
              <div class="card text-center">
              <div class="card-body">
                  <h5 class="card-title">Earthquake Past Today</h5>
                  <p class="card-text">Map showing Earthquake happening during past today. Data update every 5 minutes. </p>
                  <a href="/dashboard" class="btn btn-primary btn-block">Go to Map</a>
              </div>
              </div>
          </div>
          <div class="col-sm-3">
              <div class="card text-center">
              <div class="card-body">
                  <h5 class="card-title">Earthquake Past Week</h5>
                  <p class="card-text">Map showing Earthquake happening during past seven days or week. Data update every 5 minutes. </p>
                  <a href="/weekmap" class="btn btn-primary btn-block">Go to Map</a>
              </div>
              </div>
          </div>
          <div class="col-sm-3">
              <div class="card text-center">
              <div class="card-body">
                  <h5 class="card-title">Special title treatment</h5>
                  <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                  <a href="#" class="btn btn-primary btn-block">Go somewhere</a>
              </div>
              </div>
          </div>
      </div>
  </div>
  <div class="container-fluid">
      <div class="row">
              <div id="map-container-card" class="card">
                  <div class="card-body">
                      <div class="text-center">
                          <h2 class="card-title">Earthquake Past Today</h2>
                          <hr></hr>
                      </div>
                      <div id="map-container"></div>
                  </div>
              </div>
      </div>
  </div>
  
@endsection