<script>
  
  function autoSetup () {

  }

</script>

<div class="welcome">
  <div class="welcome-icon">
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 18 18" >
    <defs>
      <style>
        .fill {
          fill: var(--spectrum-global-color-indigo-600);
        }
      </style>
    </defs>
    <title>S Table 18 N</title>
    <rect id="Canvas" fill="#ff13dc" opacity="0" width="18" height="18" /><path class="fill" d="M16.5,1H1.5a.5.5,0,0,0-.5.5v15a.5.5,0,0,0,.5.5h15a.5.5,0,0,0,.5-.5V1.5A.5.5,0,0,0,16.5,1ZM6,16H2V14H6Zm0-3H2V11H6Zm0-3H2V8H6Zm10,6H7V14h9Zm0-3H7V11h9Zm0-3H7V8h9Zm0-3H2V2H16Z" />
  </svg>
  </div>

  <div class="welcome-text">
    <h2> Welcome to the Super Table Component </h2>
    <p> You need to connect your Super Table to a Data Provider </p>
    <p> and select the <strong>Unique ID Column</strong> </p>
    <p> Then add some Super Columns to start designing you table </p>
  </div>
</div>

<style>
h2 {
  padding-top: none;
  margin-top: unset;
}
.welcome {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-content: middle;
    gap: 20px;
  }

  .welcome-text, .welcome-icon {

  }
</style>