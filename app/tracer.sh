for value in {2000000..2100000..1000}
do
    value2=$((value + 1000))
    echo 'Current range: ' $value - $value2
    ./trace_loop-linux $value $value2
    sleep 2
    ./requester
    sleep 5
    rm -f trace-requests.txt
    sleep 5
done
echo All done