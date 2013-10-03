<?php
	try
	{
	  $payload = json_decode($_REQUEST["payload"]);
	}
	catch (Exception $e)
	{
	  exit(0);
	}

	if (null != $payload && $payload->ref === "refs/heads/master")
	{
		exec("deployFromGitHub.sh");
	}
?>